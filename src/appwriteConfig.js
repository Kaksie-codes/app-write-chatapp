import { Client, Databases } from 'appwrite';

export const PROJECT_ID = '64e92bdddb946152ee5d';
export const DATABASE_ID = '64e92f822f04187a27dc';
export const COLLECTION_ID_MESSAGES = '64e92fa87f1f2efdb6b7';

const client = new Client();
export const databases = new Databases(client);

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('64e92bdddb946152ee5d');

export default client;