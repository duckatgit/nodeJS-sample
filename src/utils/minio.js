const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT, 10) || 9000,
    useSSL: false, // Set to true if using HTTPS
    accessKey: process.env.MINIO_ACCESS_KEY || 'youraccesskey',
    secretKey: process.env.MINIO_SECRET_KEY || 'yoursecretkey',
});

const createBucket = async (bucketName) => {
    try {
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            await minioClient.makeBucket(bucketName);
            return bucketName;
        } else {
            return `Bucket "${bucketName}" already exists.`;
        }
    } catch (error) {
        console.error('Error creating bucket:', error);
    }
}

const createFolder = async (bucketName, folderName) => {
    try {
        const folderKey = `${folderName}/`;
        await minioClient.putObject(bucketName, folderKey, Buffer.alloc(0));
        return folderName;
    } catch (error) {
        return 'Error creating folder';
    }
}

const deleteFolder = async (bucketName, folderName) => {
    try {
        const objectsToDelete = [];
        const stream = minioClient.listObjectsV2(bucketName, `${folderName}/`, true);

        // Collect all object names within the folder
        for await (const obj of stream) {
            objectsToDelete.push(obj.name);
        }

        if (objectsToDelete.length > 0) {
            // Delete the objects
            await minioClient.removeObjects(bucketName, objectsToDelete);
            console.log(`Folder "${folderName}" and its contents were deleted successfully.`);
        } else {
            console.log(`Folder "${folderName}" is empty or does not exist.`);
        }
    } catch (error) {
        console.error('Error deleting folder:', error);
    }
}

module.exports = { createBucket, createFolder, deleteFolder }