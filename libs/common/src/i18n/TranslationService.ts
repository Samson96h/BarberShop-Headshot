import { Injectable } from '@nestjs/common';
import { translations } from './languages';


@Injectable()
export class TranslationService {

    translate(lang: string, key: string): string {

        const dictionary = translations[lang] || translations.en;

        return dictionary[key] || key;
    }
}