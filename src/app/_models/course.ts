import { Student } from './student'

export class Course {
  id: string;
  name: string;
  teacher: string;
  classroom: string;
  hours: number;
  date_init: string;
  date_end: string;

  students: Student[]

  constructor(){
    this.students = new Array<Student>();
  }

}
