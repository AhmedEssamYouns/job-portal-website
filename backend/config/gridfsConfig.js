const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let bucket;

const initGridFSBucket = () => {
  const connection = mongoose.connection;

  if (!connection.db) {
    console.error('MongoDB connection is not ready');
    return;
  }

  bucket = new GridFSBucket(connection.db, { bucketName: 'uploads' });
  console.log('GridFSBucket initialized');
};

const getGridFSBucket = () => {
  if (!bucket) {
    throw new Error('GridFSBucket is not initialized');
  }
  return bucket;
};

module.exports = { initGridFSBucket, getGridFSBucket };
