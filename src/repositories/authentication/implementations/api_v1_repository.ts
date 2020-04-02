import Axios, { AxiosInstance } from 'axios';
import { UserToken } from '../../../models/user_token';
import qs from 'querystring';
import { UserProfile } from '../../../models/user_profile';
import { ConfigContextParams } from '../../../context/config_context';
import { AuthenticationRepository } from '../authentication_repository';
const TOKEN_STORAGE_KEY = 'token';

export class ApiV1AuthenticationRepository implements AuthenticationRepository {
  constructor(config: ConfigContextParams, requestClient?: AxiosInstance) {
    this.axios = requestClient ?? Axios.create({});
    this.config = config;
  }

  config: ConfigContextParams;

  axios: AxiosInstance;

  /**
   *
   * @param {UserToken} tokenObject
   */

  saveToken(tokenObject: UserToken) {
    try {
      if (
        typeof tokenObject === 'object' &&
        'accessToken' in tokenObject &&
        'refreshToken' in tokenObject
      ) {
        localStorage.setItem(
          TOKEN_STORAGE_KEY,
          JSON.stringify(tokenObject.toMap())
        );
      } else {
        throw TypeError(
          'Token Object must be an object containing access and refresh tokens'
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  clearSession() {
    localStorage.setItem(TOKEN_STORAGE_KEY, '');
  }

  getToken = () => {
    try {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
      if (!storedToken) {
        return null;
      }
      const tokenMap = JSON.parse(storedToken);

      return UserToken.fromMap(tokenMap);
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  /**
   * @returns {Promise<boolean>}
   */
  isLoggedIn = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      try {
        const token = this.getToken();
        const isValid = token?.accessTokenExpiry
          ? token.accessTokenExpiry.getTime() > new Date(Date.now()).getTime()
          : false;
        resolve(!!isValid);
      } catch (e) {
        console.error(e);
        resolve(false);
      }
    });
  };

  async fetchToken(code: string) {
    const tokenUrl = `${this.config.authBaseUrl}/token`;
    const requestParams = {
      code,
      grant_type: 'authorization_code',
      client_id: this.config.clientId,
      redirect_uri: `${this.config.baseUrl}/auth_callback`,
    };
    const { data } = await Axios.post(tokenUrl, qs.stringify(requestParams), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Origin: this.config.baseUrl,
        Accept: '*/*',
      },
    });
    const {
      access_token,
      refresh_token,
      expires_in,
      refresh_expires_in,
    } = data;
    const currentTime = new Date();
    const userToken = new UserToken({
      accessToken: access_token as string,
      refreshToken: refresh_token as string,
      accessTokenExpiry: new Date(
        (currentTime.getTime() + expires_in * 1000) as number
      ),
      refreshTokenExpiry: new Date(
        (currentTime.getTime() + refresh_expires_in * 1000) as number
      ),
    });
    this.saveToken(userToken);
    return userToken;
  }

  async getUserProfile(): Promise<UserProfile> {
    console.log(this.config.authBaseUrl);
    const userProfileData = await this.axios.get(
      `${this.config.authBaseUrl}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()?.accessToken}`,
        },
      }
    );
    return new UserProfile({
      username: userProfileData.data.preferred_username,
      firstName: userProfileData.data.given_name,
      lastName: userProfileData.data.family_name,
      email: userProfileData.data.email,
    });
  }
}