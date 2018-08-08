import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StudentsService } from '../_services/student/students.service'

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Student } from '../_models/student';

import {MatDialog, MatDialogRef } from '@angular/material';
import { NewStudentComponent } from '../new-student/new-student.component';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit, OnDestroy {

  private studentSubscription: Subscription;
  private student: Student;
  private studentDialog: MatDialogRef<NewStudentComponent, any>;

  constructor(
    private studentService: StudentsService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.subscribeStudent(this.route.snapshot.paramMap.get('id'));
  }

  ngOnDestroy(){
    this.unsubscribeStudent();
  }

  subscribeStudent(id: string){
    if (!id){
      this.router.navigate(['home']);
      return;
    }
    if (this.studentSubscription){
      return;
    }
    this.studentSubscription = this.studentService.getStudentInfo(id)
    .subscribe(
      (student: Student) => {
        this.bindStudent(student);
      },
      ((error: Error) => {
        console.log(error);
      })
    );
  }

  unsubscribeStudent(){
    if (this.studentSubscription){
      this.studentSubscription.unsubscribe();
      this.studentSubscription = null;
    }
  }

  bindStudent(student: Student){
    this.student = student;
  }

  showStudentDialog(event: Event, student: Student){
    event.preventDefault();
    this.studentDialog = this.dialog.open(NewStudentComponent, {
      width: '2500px',
      data: {
        'type': NewStudentComponent.MODIFY,
        'student': student
      }
    });

    this.studentDialog.afterClosed()
      .subscribe(result => {
          if (result){
            this.subscribeStudent(student.id);
          }
      });
  }

  showDeleteAlert(event: Event, studentId: string){
    event.preventDefault();
    this.studentService.deleteStudent(studentId)
      .then((res: any) => {
        this.router.navigate(['home']);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

}
