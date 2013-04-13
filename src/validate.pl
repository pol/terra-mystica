#!/usr/bin/perl -w

use CGI qw(:cgi);
use Crypt::CBC;
use Crypt::Eksblowfish::Bcrypt qw(de_base64);
use DBI;
use File::Slurp qw(read_file);

print "Content-type: text/html\r\n";
print "Cache-Control: no-cache\r\n";
print "\r\n";

my @error = ();

my $q = CGI->new;
my $token = $q->param('token');

sub add_user {
    my ($user, $email, $hashed_password) = @_;

    my $dbh = DBI->connect("dbi:Pg:dbname=terra-mystica", '', '',
                           { AutoCommit => 0, RaiseError => 1});

    $dbh->do('insert into player (username, password) values (?, ?)', {},
             $user, $hashed_password);
    $dbh->do('insert into email (address, player, validated) values (?, ?, ?)',
             {}, $email, $user, 1);
    $dbh->commit();
    $dbh->disconnect();
}

sub check_token {
    my $secret = read_file("../../data/secret");
    my $iv = read_file("../../data/iv");

    my $cipher = Crypt::CBC->new(-key => $secret,
                                 -blocksize => 8,
                                 -iv => $iv,
                                 -add_header => 0,
                                 -cipher => 'Blowfish');
    my $data = $cipher->decrypt(de_base64 $token);
    add_user split /\t/, $data;
}

eval {
    check_token;
    print "<h3>Account created</h3>";
}; if ($@) {
    print STDERR "token: $token\n";
    print STDERR $@;
    print "<h3>Validation failed</h3>";
}
