#!/usr/bin/perl -w

use strict;

use db;
use create_game;

my $id = shift;
my $admin = shift;

die "Usage: $0 id [admin]\n" if !$id or $id =~ /[^A-Za-z0-9]/;

my $dbh = get_db_connection;

my ($write_id) = create_game $dbh, $id, $admin;

print "http://terra.snellman.net/game/$id\n";
print "http://terra.snellman.net/edit/$write_id\n";
