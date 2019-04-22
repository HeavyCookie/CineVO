import { schedule } from 'node-cron'
import { refreshMoviesFromAllocine } from '../lib/allocine-screenings'

schedule('0 0 4 * * 3', () => refreshMoviesFromAllocine('P1140'))
