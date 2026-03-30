import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app';
import { DashboardComponent } from './dashboard/dashboard';
import { HomeComponent } from './home/home';
import { AboutComponent } from './about/about';
import { FeedbackComponent } from './feedback/feedback';

@NgModule({
  declarations: [AppComponent, DashboardComponent, HomeComponent, AboutComponent, FeedbackComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [AppComponent],
})
export class AppModule {}
