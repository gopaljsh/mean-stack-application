import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
    // posts = [
    //     {title: 'First post', content: 'This is the first post content'},
    //     {title: 'Second post', content: 'This is the second post content'},
    //     {title: 'third post', content: 'This is the third post content'}
    // ]
    posts = [];
    constructor() {}

    ngOnInit() {
    }
}