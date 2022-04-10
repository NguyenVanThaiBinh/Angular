
import { BookData } from './../../dtos/bookdata.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormService } from '../Service/form-service/form-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  public form! : FormGroup;

 
  

  constructor(private formsBuilder: FormBuilder,
    private formsService: FormService,
    private toastService: ToastrService, ) { }

  ngOnInit(): void {
    this.getForm();

  }

  getForm(){
    this.form = this.formsBuilder.group({
          bookName: ['',[Validators.required, Validators.maxLength(20)]],
          author: ['',[Validators.required, Validators.maxLength(30)]],
          describe: ['',[Validators.required,Validators.maxLength(400)]]
        })
  }
  submit(){
    console.log(this.form.value);

    if(this.form.invalid)
    return;

    const dto: BookData = {       
      bookName: this.form.value.bookName,
      author:this.form.value.author,
      describe: this.form.value.describe,
    } as BookData

    this.formsService.addBookData(dto).subscribe((res) => {          
      this.toastService.success('Add successfully!',dto.bookName);
      this.form.reset();
      this.getForm();
      
    },(error) => this.toastService.error('Error adding!!!', error)
  );

  }

}
