import config from 'config'

export const isProduction: boolean = config.get<string>('env') === 'production'
