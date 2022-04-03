import * as React from 'react'
import { useState, useEffect } from 'react'
import fetchJson from '../httpClient'
import { IAccessProp, IUser } from '../interface'
import './Profile.scss'


export const Profile = ({ accessToken }: IAccessProp ) => {

  const [user, setUser] = useState<IUser>({
    name: '',
    image: '',
    followers: ''
  })

  const getUser = async () => {
    const user = await fetchJson('/user', accessToken)
    setUser({
      name: user.display_name,
      image: user.images[0].url,
      followers: user.followers.total
    })
  }
  
  useEffect(() => {
    getUser();
  }, [])

  return (
    <section className='profile'>
      <img src={user.image} alt='profile' className='profile__image' />
      <section className='profile__info'>
      <p className='profile__name'>{user.name}</p>
      <p className='profile__followers'>{user.followers} followers</p>
      </section>
    </section>
  )
}