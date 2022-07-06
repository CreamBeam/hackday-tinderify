import * as React from 'react';
import { createContext, useEffect, useState } from 'react';
import { get, post } from '../httpClient';
import { authObserver } from '../firebase/auth';
import { handleLogIn } from '../modules/modules';

export interface IUser {
  mail: string;
  loggedIn: boolean;
  spotify: {
    connected: boolean;
    profile: {
      image: string;
      name: string;
      id: string;
    };
    accessToken: string;
  };
}

export const userObject = {
  mail: '',
  loggedIn: false,
  spotify: {
    connected: false,
    profile: {
      image: '',
      name: '',
      id: '',
    },
    accessToken: '',
  },
};

interface IUserContextProviderProps {
  children: any;
}

const UserContext = createContext<IUser | null>(null);

const UserContextProvider = ({ children }: IUserContextProviderProps) => {
  const [user, setUser] = useState<IUser>(userObject);

  useEffect(() => {
    authObserver(setUser);
  }, []);

  useEffect(() => {
    const localFire = localStorage.getItem('auth');

    if (!localFire) return;

    const localSpot = localStorage.getItem('spot');

    if (!localSpot) {
      localStorage.setItem('spot', 'redirected');
      handleLogIn();
    }

    const getToken = async () => {
      try {
        const token = await get('/auth/token');

        setUser((prevState: IUser) => ({
          ...prevState,
          spotify: {
            ...prevState.spotify,
            connected: true,
            accessToken: token.access_token,
          },
        }));
      } catch (error) {
        console.log(error);
      }
    };

    if (localSpot === 'redirected') {
      getToken();
    }
  }, [user.loggedIn]);

  useEffect(() => {
    const getSpotifyUser = async () => {
      const spotifyUser = await post('/user', {
        token: user.spotify.accessToken,
      });
      setUser((prevState: IUser) => ({
        ...prevState,
        spotify: {
          ...prevState.spotify,
          profile: {
            image: spotifyUser.images[0].url,
            name: spotifyUser.display_name,
            id: spotifyUser.id,
          },
        },
      }));
    };

    if (user.spotify.accessToken) {
      getSpotifyUser();
    }
  }, [user.spotify.accessToken]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export { UserContext, UserContextProvider };
