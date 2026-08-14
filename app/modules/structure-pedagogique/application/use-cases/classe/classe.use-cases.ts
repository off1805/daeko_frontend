import type { UseCase } from "~/shared/domain/use-case";
import type {
  ClasseFilters,
  ClasseRepository,
  CreerClasseInput,
  ModifierClasseInput,
} from "~/modules/structure-pedagogique/domain/repositories/structure.repository";
import type { ClasseDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto";
import { toClasseDto } from "~/modules/structure-pedagogique/application/mappers/structure.mappers";

interface ListerClassesInput {
  configurationId: string;
  filters?: ClasseFilters;
}

export class ListerClassesUseCase implements UseCase<ListerClassesInput, ClasseDto[]> {
  constructor(private readonly repository: ClasseRepository) {}

  async execute({ configurationId, filters }: ListerClassesInput): Promise<ClasseDto[]> {
    const classes = await this.repository.list(configurationId, filters);
    return classes.map(toClasseDto);
  }
}

interface CreerClasseUseCaseInput {
  configurationId: string;
  data: CreerClasseInput;
  auteurId: string;
}

/** Doc 5.4 : un seul endpoint pour la création unitaire et la création en série ({ suffixes: [...] }). */
export class CreerClasseUseCase implements UseCase<CreerClasseUseCaseInput, ClasseDto[]> {
  constructor(private readonly repository: ClasseRepository) {}

  async execute({
    configurationId,
    data,
    auteurId,
  }: CreerClasseUseCaseInput): Promise<ClasseDto[]> {
    const classes = await this.repository.creer(configurationId, data, auteurId);
    return classes.map(toClasseDto);
  }
}

interface ModifierClasseUseCaseInput {
  id: string;
  data: ModifierClasseInput;
  auteurId: string;
}

export class ModifierClasseUseCase implements UseCase<ModifierClasseUseCaseInput, ClasseDto> {
  constructor(private readonly repository: ClasseRepository) {}

  async execute({ id, data, auteurId }: ModifierClasseUseCaseInput): Promise<ClasseDto> {
    return toClasseDto(await this.repository.modifier(id, data, auteurId));
  }
}

interface DesactiverClasseInput {
  id: string;
  motif: string;
  auteurId: string;
}

export class DesactiverClasseUseCase implements UseCase<DesactiverClasseInput, ClasseDto> {
  constructor(private readonly repository: ClasseRepository) {}

  async execute({ id, motif, auteurId }: DesactiverClasseInput): Promise<ClasseDto> {
    return toClasseDto(await this.repository.desactiver(id, motif, auteurId));
  }
}

interface ReactiverClasseInput {
  id: string;
  auteurId: string;
}

export class ReactiverClasseUseCase implements UseCase<ReactiverClasseInput, ClasseDto> {
  constructor(private readonly repository: ClasseRepository) {}

  async execute({ id, auteurId }: ReactiverClasseInput): Promise<ClasseDto> {
    return toClasseDto(await this.repository.reactiver(id, auteurId));
  }
}
