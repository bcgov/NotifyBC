import { Controller, Get, Query } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { writeHeapSnapshot } from 'node:v8';
import { Role } from 'src/auth/constants';
import { Roles } from 'src/auth/roles.decorator';
import { MemoryService } from './memory.service';

@Controller('memory')
@ApiExcludeController()
@Roles(Role.SuperAdmin)
export class MemoryController {
  constructor(private readonly memoryService: MemoryService) {}

  @Get()
  dumpMemory(@Query('fileName') fileName?: string) {
    // Generate a heapdump for the main thread.
    return writeHeapSnapshot(fileName);
  }
}
