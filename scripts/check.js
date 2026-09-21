import {readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
for(const dir of ['src','web','scripts','tests'])for(const name of await readdir(dir)){if(name.endsWith('.js')){const result=spawnSync(process.execPath,['--check',`${dir}/${name}`],{stdio:'inherit'});if(result.status!==0)process.exit(1);}}
console.log('All JavaScript syntax checks passed.');
