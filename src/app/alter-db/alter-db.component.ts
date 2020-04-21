import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-alter-db',
  templateUrl: './alter-db.component.html',
  styleUrls: ['./alter-db.component.css']
})
export class AlterDBComponent implements OnInit {

  collapsed: boolean = true;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  switchCollapse() {
    this.collapsed = !this.collapsed;
  }

  logout() {
    this.authService.logout();
  }

}
