import { NgModule } from '@angular/core';
import { NbAuthModule } from '@nebular/auth';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './auth.guard';
import { NoAuthGuard } from './no-auth.guard';
import { Store } from '../services';
import { AuthService, AuthStrategy } from './services';
// @ts-ignore
import { environment } from '@env/environment';

export * from './services';
export * from './auth.guard';
export * from './no-auth.guard';

const socialLinks = [
	{
		url: environment?.GOOGLE_AUTH_LINK,
		icon: 'google-outline',
	},
	{
		url: environment?.LINKEDIN_AUTH_LINK,
		icon: 'linkedin-outline',
	},
	{
		url: environment?.GITHUB_AUTH_LINK,
		target: '_blank',
		icon: 'github-outline',
	},
	{
		url: environment?.TWITTER_AUTH_LINK,
		target: '_blank',
		icon: 'twitter-outline',
	},
	{
		url: environment?.FACEBOOK_AUTH_LINK,
		target: '_blank',
		icon: 'facebook-outline',
	},
	{
		url: environment?.MICROSOFT_AUTH_LINK,
		target: '_blank',
		icon: 'grid',
	},
];

@NgModule({
	imports: [
		CommonModule,
		NbAuthModule.forRoot({
			strategies: [AuthStrategy.setup({ name: 'email' })],
			forms: {
				login: { socialLinks },
				register: { socialLinks },
			},
		}),
	],
	providers: [
		...NbAuthModule.forRoot({
			strategies: [AuthStrategy.setup({ name: 'email' })],
			forms: {
				login: { socialLinks },
				register: { socialLinks },
			},
		}).providers,
		AuthGuard,
		NoAuthGuard,
		AuthStrategy,
		AuthService,
		Store,
	],
})
export class AuthModule {}
