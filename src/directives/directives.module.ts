import { NgModule } from '@angular/core';
import { MatchHeightDirective } from './match-height/match-height';
import { KeyboardfixDirective } from './keyboardfix/keyboardfix';
@NgModule({
	declarations: [MatchHeightDirective,
    KeyboardfixDirective],
	imports: [],
	exports: [MatchHeightDirective,
    KeyboardfixDirective]
})
export class DirectivesModule {}
