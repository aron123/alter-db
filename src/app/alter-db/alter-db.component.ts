import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-alter-db',
  templateUrl: './alter-db.component.html',
  styleUrls: ['./alter-db.component.css']
})
export class AlterDBComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
  }

}
