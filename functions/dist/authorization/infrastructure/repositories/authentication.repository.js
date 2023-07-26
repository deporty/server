"use strict";
// import { Observable, from } from 'rxjs';
// import { AuthenticationContract } from '../../domain/contracts/authentication.contract';
// import { map } from 'rxjs/operators';
// import { Auth } from 'firebase-admin/auth';
// export class AuthenticationRepository extends AuthenticationContract {
//   constructor( private auth: Auth){
//     super()
//   }
//   login(username: string, password: string): Observable<string> {
//     return from(this.auth.  .signInWithEmailAndPassword(auth, email, password)).pipe(
//       map((item: any) => {
//         if (item) {
//           console.log('Linkin park', item);
//           return item.user.accessToken;
//         }
//         return null;
//       })
//     );
//   }
// }
