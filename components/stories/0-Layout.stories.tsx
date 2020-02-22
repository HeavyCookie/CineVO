import React from 'react'

import './i18n'
import Layout from '../src/Layout'

export default {
  title: 'Layout',
  component: Layout,
}

export const LoggedOff = () => <Layout>Content</Layout>
LoggedOff.story = { name: 'Logged off user' }

export const LoggedIn = () => <Layout isLoggedIn>Content</Layout>
LoggedIn.story = { name: 'Logged in user' }
