import { ModuleMetadata } from '@nestjs/common';

export interface ITelegramOptions {
	chatId: string;
	token: string;
}

export interface ITelegramModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	useFactory: (...args: any[]) => Promise<ITelegramOptions> | ITelegramOptions;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	inject?: any[];
}