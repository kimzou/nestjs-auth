import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthenticationError } from 'apollo-server-core';
import * as admin from 'firebase-admin';
import { Model } from 'mongoose';
import { User, UserDocument } from './../users/user.model';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  //TODO: put method in guard
  async validateIdToken(idToken: string): Promise<boolean|void>  {
    try {
      await admin.auth().verifyIdToken(idToken);
      return true
    } catch (error) {
      throw new AuthenticationError(error);
    }
  }

  async setClaims({ uid, id, role }): Promise<void> {
    try {
      await admin.auth().setCustomUserClaims(uid, {
        id,
        role
      })
    } catch (error) {
      console.log('Catch error setting user claims :', error)
    }
  }

  async register({ registerInput, ctx }): Promise<User> {
    const { email, uid, displayName, idToken } = registerInput;

    try {
      // check is email exists
      const userExists = await this.userModel.findOne({ email });
      if (userExists) throw new AuthenticationError('This email is already used');

      // set new user properties and save it
      const userProp = {
        name: displayName,
        email,
        firebaseUid: uid
      }
      const createdUser = new this.userModel(userProp);
      await createdUser.save()
      // set claims
      this.setClaims({ uid, id: createdUser._id, role: createdUser.role })
      // create cookie session
      await this.session(idToken, ctx)
      return createdUser
    } catch (error) {
      throw new AuthenticationError(error)
    }
  }

  async login({ loginInput, ctx }): Promise<User> {
    const { idToken, uid } = loginInput;
    let user: UserDocument
    try {
      user = await this.userModel.findOne({ firebaseUid: uid })
      await this.session(idToken, ctx);
      return user
    } catch (error) {
      throw new AuthenticationError(error)
    }
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
