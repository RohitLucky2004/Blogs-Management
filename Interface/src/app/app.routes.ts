import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { getLocaleDirection } from '@angular/common';

export const routes: Routes = [
    {
    path: 'home',
    title:'Home',
    canActivate:[AuthGuard],
    component: HomeComponent,
     children: [
        {
            path: 'blog',
            title:'Blog Create',
            canActivate:[AuthGuard],
            loadComponent: () => import('./home/blog/blog.component').then(m => m.BlogComponent)
        },
        {
            path: 'profile/update',
            title: 'update',
            canActivate:[AuthGuard],
            loadComponent:()=> import('./sign-up/sign-up.component').then(m => m.SignUpComponent)
        },
        {
            path:'profile',
            title:'profile',
            canActivate:[AuthGuard],
            loadComponent:()=> import('./home/profile/profile.component').then(m => m.ProfileComponent ),
        },
        {
            path:'publisher/profile',
            title:'Publisher Profile',
            loadComponent:()=>import('./home/profile/profile.component').then(m=>m.ProfileComponent)
            
        },
        {
            path:'profile/myblogs',
            title:'My Blogs',
            canActivate:[AuthGuard],
            loadComponent:()=> import('./home/blog-list/blog-list.component').then(m=>m.BlogListComponent)
        },
        {
            path:'profile/myblogs/blogEdit',
            title:'Edit Blog',
            canActivate:[AuthGuard],
            loadComponent:()=>import('./home/blog/blog.component').then(m=>m.BlogComponent)
        },
        {
            path:'blogView',
            title:'View',
            loadComponent:()=>import('./home/blog-list/blog-details/blog-details.component').then(m=>m.BlogDetailsComponent)
        },
        {
            path:'',
            title:'home',
            canActivate:[AuthGuard],
            loadComponent:()=> import('./home/blog-list/blog-list.component').then(m=>m.BlogListComponent)
        }
        ]
    },
 
    {
        path:'login',
        loadComponent:()=>import('./login/login.component').then(m=>m.LoginComponent)
    },
    {
        path:'signUp',
        loadComponent:()=>import('./sign-up/sign-up.component').then(m=>m.SignUpComponent)
    },
    {
        path: '',
        redirectTo:'login',
        pathMatch:'full'

    },
];
