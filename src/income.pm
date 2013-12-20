package terra_mystica;

use strict;

use factions;
use tiles;
use resources;
use scoring;

use vars qw(%game);

sub faction_income {
    my $faction_name = shift;
    my $faction = $factions{$faction_name};

    my %total_income = map { $_, 0 } qw(C W P PW);

    my %total_building_income = %total_income;
    my %total_favor_income = %total_income;
    my %total_bonus_income = %total_income;
    my %total_scoring_income = %total_income;

    my %buildings = %{$faction->{buildings}};

    for my $building (values %buildings) {
        if (exists $building->{income}) {
            my %building_income = %{$building->{income}};
            for my $type (keys %building_income) {
                my $delta = $building_income{$type}[$building->{level}];
                if ($delta) {
                    $total_building_income{$type} += $delta;
                }
            }
        }
    }

    for my $tile (keys %{$faction}) {
        if (!$faction->{$tile}) {
            next;
        }

        if ($tile =~ /^(BON|FAV)/) {
            my $tile_income = $tiles{$tile}{income};
            for my $type (keys %{$tile_income}) {
                if ($tile =~ /^BON/ and $faction->{passed}) {
                    $total_bonus_income{$type} += $tile_income->{$type};
                } elsif ($tile =~ /^FAV/) {
                    $total_favor_income{$type} += $tile_income->{$type};
                }
            }
        }
    }

    my $scoring = current_score_tile;
    if ($scoring and $game{round} != 6) {
        my %scoring_income = %{$scoring->{income}};

        my $mul = int($faction->{$scoring->{cult}} / $scoring->{req});
        for my $type (keys %scoring_income) {
            $total_scoring_income{$type} += $scoring_income{$type} * $mul;
        }        
    }

    # XXX: Nasty. Mutate the faction every time this function gets called,
    # rather than return the breakdown.
    $faction->{income_breakdown} = {};

    $faction->{income_breakdown}{bonus} = \%total_bonus_income;
    $faction->{income_breakdown}{scoring} = \%total_scoring_income;
    $faction->{income_breakdown}{favors} = \%total_favor_income;
    $faction->{income_breakdown}{buildings} = \%total_building_income;

    for my $subincome (values %{$faction->{income_breakdown}}) {
        my $total = 0;
        for my $type (keys %{$subincome}) {
            $total_income{$type} += $subincome->{$type};
            if (grep { $type eq $_} qw(C W P PW)) {
                $total += $subincome->{$type};
            }
        }
        if (!$total) {
            $subincome = undef;
        }
    }

    return %total_income;
}

sub take_income_for_faction {
    my $faction_name = shift;
    my $faction = $factions{$faction_name};
    die "Taking income twice for $faction_name\n" if
        $faction->{income_taken};

    if ($game{round} == 0) {
        $faction->{passed} = 1;
    }

    my %income = faction_income $faction_name;
    gain $faction, \%income;
        
    $faction->{income_taken} = 1;

    if ($faction->{SPADE}) {
        push @action_required, { type => 'transform',
                                 amount => $faction->{SPADE}, 
                                 faction => $faction->{name} };
    }
}

1;
