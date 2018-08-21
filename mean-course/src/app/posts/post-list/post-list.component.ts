import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";

import { PostService } from "../post.service";
import { Post } from "../post.model";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

    private postSub: Subscription;
    private authServiceSubscription: Subscription;
    userAuthenticated = false;
    userId: string;
    posts: Post[] = [];
    isLoading = false;
    totalPosts = 0;
    postsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1,2,5,10]

    constructor(private postService: PostService, private authService: AuthService) {}

    ngOnInit() {
        this.isLoading = true;
        this.postService.getPosts(this.postsPerPage, 1);
        this.userId = this.authService.getUserId();
        this.postSub = this.postService.getPostUpdateListener()
            .subscribe((postsData: {posts: Post[], postCount: number}) => {
                this.isLoading = false;
                this.posts = postsData.posts;
                this.totalPosts = postsData.postCount;
            })
        this.userAuthenticated = this.authService.getAuthStatusUpdated();
        this.authServiceSubscription = this.authService.getAuthServiceListner()
            .subscribe(isAuthenticated => {
                this.userAuthenticated = isAuthenticated;
                this.userId = this.authService.getUserId();
            })
    }

    onChangedPage(pageEvent: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageEvent.pageIndex + 1;
        this.postsPerPage = pageEvent.pageSize;
        this.postService.getPosts(this.postsPerPage, this.currentPage);
    }

    onDelete(postId: string) {
        this.postService.deletePost(postId)
            .subscribe(() => {
                this.postService.getPosts(this.postsPerPage, this.currentPage);
            })
    }

    ngOnDestroy() {
        this.postSub.unsubscribe();
        this.authServiceSubscription.unsubscribe();
    }
}