import { logging } from 'protractor';
import { Posts } from './posts.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  postForm: FormGroup;
  updateForm: FormGroup;
  postsArray: Posts[] = [];
  editControl: Boolean = false;
  editPostNumber: number;

  constructor(private db: DatabaseService) {
    this.postForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      content: new FormControl(null, Validators.required)
    });
    this.updateForm = new FormGroup({
      updatedTitle: new FormControl(null),
      updatedContent: new FormControl(null)
    });
  }

  ngOnInit() {
    this.onDisplayPosts();
  }

  onPostSubmitted() {
    const inputTitle: string = this.postForm.get('title').value;
    const inputContent: string = this.postForm.get('content').value;
    this.db.addPost(inputTitle, inputContent);
    this.postForm.reset();
    setTimeout(() => {
      this.onDisplayPosts();
    }, 500);
  }

  onDisplayPosts() {
    this.db.fetchPost()
      .subscribe((responseArray) => {
        this.postsArray = responseArray;
      });
  }

  onEditPressed(index: number) {
    this.editControl = true;
    this.editPostNumber = index;
  }

  onDeletePressed(index: number) {
    this.db.deletePost(index);
    setTimeout(() => {
      this.onDisplayPosts();
    }, 500);
  }

  onUpdatePressed(index: number) {
    const inputTitle: string = this.updateForm.get('updatedTitle').value;
    const inputContent: string = this.updateForm.get('updatedContent').value;
    this.db.updatePost(inputTitle, inputContent, index);
    this.updateForm.reset();
    setTimeout(() => {
      this.onDisplayPosts();
    }, 1000);
  }
}
