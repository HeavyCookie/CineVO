import { EntityRepository, Repository } from 'typeorm'

import { Screening } from '../entity/Screening'

@EntityRepository(Screening)
export class ScreeningRepository extends Repository<Screening> {}
