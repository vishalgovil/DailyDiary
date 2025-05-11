import conf from "../conf/conf";
import {Client, ID, Databases, Storage, Query} from "appwrite";

export class Service{
    client= new Client;
    databases;
    bucket;
   
    constructor(){
       this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectID);
        this.databases= new Databases(this.client);
        this.bucket= new Storage(this.client);
    }

    async createPost({title, slug, content, featuredImage, status,userId}){
        try{
            return await this.databases.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                }
            )
        }
        catch(error){
            console.log("Appwrite service :: createPost ", error);
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}){
        try{
            return await this.databases.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug,
                {
                    title, 
                    content,
                    featuredImage, 
                    status,

                }
            )
        }
        catch(error)
        {
            console.log("Appwrite service :: updatePost ", error);
        }
    }

    async deletePost(slug){
        try{
            return await this.databases.deleteDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug
            )
            return true
        }
        catch(error){
            console.log("Error while deleting :: deletePost", error);
            return false;
        }
    }

    async getPost(slug){
        try{
            return await this.databases.getDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                slug
            
            )
        }
        catch(error){
            console.log("Error while getting post :: deletePost", error);
            return false;
        }
    }

    // Need to have indexes for queries
    async getPosts(queries = [Query.equal("status", "active")]){
        try{
            return await this.databases.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                queries,
            )
                
        }
        catch(error){
            console.log("Error while getting posts ", error);
            return false;
        }
    }

    // file upload service

    async uploadFile(file){
        // It is returning fileID
        try{
            return await this.bucket.createFile(
                conf.appwriteBucketID,
                ID.unique(),
                file
            )
        }
        catch(error){
            console.log("Uploading file error :: uploadFile ", error);
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketID,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }
    // As the response is fast, we dont need to have async
    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.appwriteBucketID,
            fileId
        )
    }
}

const service = new Service()
export default service