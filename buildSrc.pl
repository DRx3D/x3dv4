#!/usr/bin/perl
#
#	buildSrc.pl
#
#	Builds the V4 additions for X3DOM and writes the result to src/v4Nodes.js
#
#	Order of the files is not important. Just walk the directory tree in the src directory
#	appending all *.js files into the output
#

use strict;
use File::Find;

my $outputDir	= 'src';
my $outputFile	= 'v4Nodes.js';
my $inputDir	= 'src';
my $inputFiles	= '*.js';
my $errorFlag	= 0;
my @errorMsg	= ();
my $fileCount	= 0;
my $lineCount	= 0;

# --> Recursively descend directory processing each file
open (OUTPUT, ">$outputDir/$outputFile") or die "Unable to open output file ($outputDir/$outputFile)\n$!\n";
find (\&wanted, './src');
close OUTPUT;

if ($#errorMsg >= 0) {
	print "One or more errors in processing...\n";
	print join("\n", @errorMsg) . "\n";
	exit 1;
} else {
	print "$outputDir/$outputFile created from $fileCount files with $lineCount lines\n";
}
exit;

# --> Found file processing routine. 
#	Do not process 'v4Nodes.js'. Only process *.js files.
#	Keep track of the number of files and the total line count
sub wanted {
	if ($_ =~ /\.js$/ && $_ ne 'v4Nodes.js') {
		if (open (INPUT, "<$_")) {
			print "Processing $_ from $File::Find::dir\n";
			$fileCount ++;
			while (<INPUT>) {
				print OUTPUT $_;
				$lineCount ++;
			}
			close INPUT;
		} else {
			push @errorMsg, "Error opening $_ from $File::Find::dir :: $!";
			$errorFlag++;
		}
	}
}