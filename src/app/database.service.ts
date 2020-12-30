import { Posts } from './posts.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  loadedposts: Posts[] = [];
  url: string;
  constructor(private http: HttpClient) {
    this.url = 'https://angular-database-c263b-default-rtdb.firebaseio.com/posts';
  }

  addPost(inputTitle: string, inputContent: string) {
    const postData = {
      title: inputTitle,
      content: inputContent
    };

    this.http
      .post(this.url + '.json', postData)
        .subscribe(responseData => {
          console.log(responseData);
        });
  }

  fetchPost() {
     return this.http.get(this.url + '.json')
                      .pipe(
                        map((responseData) => {
                          const responseArray: Posts[] = [];
                          for(const key in responseData) {
                            if(responseData.hasOwnProperty) {
                              responseArray.push({
                                title: responseData[key].title,
                                content: responseData[key].content,
                                id: key
                              });
                            }
                          }
                          this.loadedposts = responseArray;
                          return responseArray;
                        })
                      );
  }

  updatePost(updatedTitle: string, updatedContent: string, index: number) {
    const key = this.loadedposts[index].id;
    if (updatedTitle === null && updatedContent === null) {
      console.log('No changes!');
    } else if(updatedTitle !== null && updatedContent !== null){
      const updatedData = {
        title: updatedTitle,
        content: updatedContent
      };
      this.http
        .put(this.url + '/' + key + '.json', updatedData)
          .subscribe(responseData => {
            console.log(responseData);
          });
    } else if(updatedContent === null) {
      const updatedData = {
        title: updatedTitle,
        content: this.loadedposts[index].content
      };
      this.http
        .put(this.url + '/' + key + '.json', updatedData)
          .subscribe(responseData => {
            console.log(responseData);
          });
    } else if(updatedTitle === null) {
      const updatedData = {
        title: this.loadedposts[index].title,
        content: updatedContent
      };
      this.http
        .put(this.url + '/' + key + '.json', updatedData)
          .subscribe(responseData => {
            console.log(responseData);
          });
    }
  }

  deletePost(index: number) {
    const key = this.loadedposts[index].id;
    this.http.delete(this.url + '/' + key + '.json')
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }
}
