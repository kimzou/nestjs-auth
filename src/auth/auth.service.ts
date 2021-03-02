import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthenticationError } from 'apollo-server-core';
import * as admin from 'firebase-admin';
import { Model } from 'mongoose';
import { User, UserDocument } from './../users/user.model';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async register({ registerInput, ctx }): Promise<User> {
    const { email, uid, displayName, idToken } = registerInput;

    try {
      // check is email exists
      const userExists = await this.userModel.findOne({ email });
      if (userExists) throw new AuthenticationError('This email is already used');

      // we have to fetch the user from admin to get the password
      const { passwordHash = '123456' } = await admin.auth().getUser(uid);

      // set new user properties and save it
      const userProp = {
        name: displayName,
        email,
        password: passwordHash,
        firebaseUid: uid
      }
      const createdUser = new this.userModel(userProp);
      await createdUser.save()
      // create cookie session
      await this.session(idToken, ctx)
      return createdUser
    } catch (error) {
      console.log('Catch:', error)
    }
  }

  async login({ loginInput, ctx }): Promise<User> {
    const { idToken, uid } = loginInput;
    let user: UserDocument
    try {
      user = await this.userModel.findOne({ firebaseUid: uid })
    } catch (error) {
      throw new AuthenticationError(error)
    }
    await this.session(idToken, ctx);
    return user
  }

  async session(idToken: string, ctx): Promise<void> {
    const expiresIn = 60 * 60 * 24 * 7 * 1000 // 7 days
    try {
      const sessionCookie = await admin
        .auth()
        .createSessionCookie(idToken, { expiresIn })

      // set the cookie only for this server, but not for the gateway
      const cookieOtp = {
        httpOnly: true,
        maxAge: expiresIn
      }
      ctx.res.cookie('session-cookie', sessionCookie, cookieOtp)
    } catch (error) {
      throw new AuthenticationError(error);
    }
  }
}
