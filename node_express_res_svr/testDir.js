const funcs = require('./genFuncs');

const path = require('path');
const fs = require('fs');

// funcs.print( funcs.mkdir("test1") );
// funcs.print( "2" );

// funcs.printf( path.resolve( "." ) );
// funcs.printf( __dirname );
// test.dir( __dirname );

// fs.mkdir( "test2/test3/test4", { recursive: true }, function( err, path ){
//     if ( err ) throw err;
//     console.log( "创建目录成功:", path );
// } )

// console.log( path.resolve( __dirname, "test1/test3/test4" ) );

// fs.mkdir( path.resolve( __dirname, "test1/test3/test4" ), { recursive: true }, function( err, path ){
//     if ( err ) throw err;
//     console.log( "创建目录成功:", path );
// } );

// console.log( "2222" );

console.log( path.resolve( 'hideous', "test1/test3/test4" ) );