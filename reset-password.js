import {isSupabaseConfigured,setRecoveredPassword} from './supabase.js';
const params=new URLSearchParams(location.hash.slice(1));
const accessToken=params.get('access_token');
const status=document.querySelector('#reset-status');
const form=document.querySelector('#reset-form');
if(!isSupabaseConfigured){status.textContent='Password reset is not configured for this site.'}
else if(params.get('type')!=='recovery'||!accessToken){status.textContent='This reset link is invalid or expired. Request a new one from the admin sign-in page.'}
else{form.hidden=false;status.textContent='Your reset link is ready. Choose a new password.'}
form.addEventListener('submit',async event=>{event.preventDefault();const data=new FormData(form),password=String(data.get('password')),confirm=String(data.get('confirmPassword'));if(password!==confirm){status.textContent='The passwords do not match.';return}const button=form.querySelector('button');button.disabled=true;status.textContent='Updating your password…';try{await setRecoveredPassword(accessToken,password);form.hidden=true;status.textContent='Password updated. You can now sign in to the admin dashboard.';history.replaceState(null,'',location.pathname);setTimeout(()=>location.assign('admin.html'),1800)}catch(error){status.textContent=error.message||'Could not update the password. Request a new reset email.';button.disabled=false}});
