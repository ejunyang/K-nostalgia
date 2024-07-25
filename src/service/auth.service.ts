import { Tables } from '@/types/supabase';
import { User } from '@supabase/supabase-js';

type UserType = Tables<'users'> & User;

class AuthAPI {

  private async request<T>(url: string, method: string, body?: any): Promise<T> {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`message: ${error}`);
    }

    return response.json();
  }

  async logIn(email: string, password: string): Promise<UserType> {
    return this.request<UserType>('/api/auth/log-in', 'POST', { email, password });
  }

  async signUp(email: string, password: string, nickname?: string, name?:string): Promise<UserType> {
    return this.request<UserType>('/api/auth/sign-up', 'POST', { email, password, nickname, name});
  }

  async logOut(): Promise<UserType> {
    return this.request<UserType>('/api/auth/log-out', 'DELETE');
  }

  async getUser(): Promise<UserType> {
    return this.request<UserType>('/api/auth/user', 'GET');
  }
}

export default AuthAPI;