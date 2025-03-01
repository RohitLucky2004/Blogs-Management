import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token=sessionStorage.getItem('Token');
    const username=sessionStorage.getItem('username');
    const id=sessionStorage.getItem('userId');
    const rwp=req.clone({
      params:req.params.set('user',`${username}`),
      headers:req.headers.set('authorization',`Bearer ${token}`)
    })
    return next(rwp);
};
