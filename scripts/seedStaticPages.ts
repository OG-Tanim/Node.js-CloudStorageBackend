import mongoose from 'mongoose';
import { env } from '../src/config/env';
import StaticPage from '../src/models/StaticPage';

const seedPages = async () => {
  await mongoose.connect(env.mongoUri as string);

  await StaticPage.deleteMany({});

  await StaticPage.insertMany([
    {
      key: 'terms',
      title: 'Terms & Conditions',
      content: `Welcome to Shower Share!
      <br/><br/>
      These Terms and Conditions ("Terms") govern your use of the Shower Share mobile application ("App")...`,
    },
    {
      key: 'privacy',
      title: 'Privacy Policy',
      content: `<h1>Privacy Policy</h1><p>We collect minimal data... (more content here)</p>`,
    },
    {
      key: 'about',
      title: 'About Us',
      content: `<h1>About Shower Share</h1><p>This app allows users to share and manage shower bookings...</p>`,
    },
  ]);

  console.log('Static pages seeded.');
  process.exit(0);
};

seedPages();
