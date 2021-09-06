import { PhoneData } from './../../dtos/phonedata.dto';
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

  public PhoneData : PhoneData | undefined;
  

  constructor(private formsBuilder: FormBuilder,
    private formsService: FormService,
    private toastService: ToastrService, ) { }

  ngOnInit(): void {
    this.getForm();
  }

  getForm(){
    this.form = this.formsBuilder.group({
      phoneName: ['iPhone',[Validators.required, Validators.maxLength(20)]],
      price: ['10',[Validators.required, Validators.min(1)]],
      category: ['China',[Validators.required]]
    })
  }
  submit(){
    console.log(this.form.value);

    if(this.form.invalid)
    return;

    const dto: PhoneData = {       
      name: this.form.value.phoneName,
      price:this.form.value.price,
      category: {        
        name:this.form.value.category
      }
    } as PhoneData

    this.formsService.addPhoneData(dto).subscribe((res) => {          
      this.toastService.success('Add successfully!',dto.name);
      this.form.reset();
      this.getForm();
      
    },(error) => this.toastService.error('Error adding!!!', error)
  );

  }

}
