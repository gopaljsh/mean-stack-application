import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Post } from "./post.model";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class PostService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

    constructor(private http: HttpClient, private router: Router) {}

    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`
        this.http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
            .pipe(map(postData => {
                return {
                    posts: postData.posts.map((post) => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id,
                        imagePath: post.imagePath
                    }
                    }),
                    maxPosts: postData.maxPosts
                }
            }))
            .subscribe((transformedPost) => {
                this.posts = transformedPost.posts;
                this.postsUpdated.next({posts: [...this.posts], postCount: transformedPost.maxPosts});
            })
    }

    getPost(id: string) {
        //return {...this.posts.find(p => p.id === id)};
        return this.http.get<{_id: string, title: string, content: string, imagePath: string}>("http://localhost:3000/api/posts/" + id)
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    deletePost(postId: string){
       return this.http.delete("http://localhost:3000/api/posts/" + postId);
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: FormData | Post;
        if(typeof image === "object") {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        } else {
            postData = {id: id, title: title, content: content, imagePath: image }
        }

        this.http.put('http://localhost:3000/api/posts/' + id, postData)
            .subscribe((responseData) => {
                this.router.navigate(['/']);
            });   
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
            .subscribe((responseData) => {
                this.router.navigate(['/']);
            })
    }
}