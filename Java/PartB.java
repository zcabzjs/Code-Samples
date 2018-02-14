/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import java.util.Arrays;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
/**
 *
 * @author User
 */
public class PartB {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args){
        // TODO code application logic here
        BufferedWriter bw = null;
        FileWriter fw = null;
        int players = 0;
        try{
            players = Integer.parseInt(args[0]);
            System.out.format("Number of players: %d\n", players);

        }catch(NumberFormatException e){
            System.out.println("Number of players expected in argument");
            System.exit(0);
        }
        boolean extra = false;        // For bonus question
        if(players % 2 == 1){
            players++;
            extra = true;
        }

        int totalRounds = (players - 1);
        int matchesPerRound = players/2;
        String[][] rounds = new String[totalRounds*2][matchesPerRound];
        // Circle scheduling algorithm used
        // For question 1 and 3
        for(int round = 0; round < totalRounds; round++){
            for(int match = 0; match < matchesPerRound; match++){
                int home = (round + match) % (players - 1);
                int away = (players - 1 - match + round) % (players - 1);
                if(match == 0){            // Fix one team, while the other players rotate around it
                    away = players - 1;
                }
                if(extra){
                    if(home != players - 1 && away != players - 1){
                        rounds[round][match] = "Player " + (home + 1) + " vs " + "Player " + (away + 1);
                        rounds[round+totalRounds][match] = "Player "  + (away + 1) + " vs " + "Player " + (home + 1);
                    }
                    else{
                        // For bonus question
                        // Happens when theres an odd number of players, and a match is not played because of missing player
                        rounds[round][match] = "Bye";
                        rounds[round+totalRounds][match] = "Bye";
                    }
                }
                else{
                    rounds[round][match] = "Player " + (home + 1) + " vs " + "Player " + (away + 1);
                    rounds[round+totalRounds][match] = "Player "  + (away + 1) + " vs " + "Player " + (home + 1);
                }

            }
        }

        // For question 2
        for(int round = 0; round < rounds.length; round++){
            try{
                String filename = "Round " + (round+1);
                fw = new FileWriter(filename+".txt");
                bw = new BufferedWriter(fw);
                bw.write(filename+"\n");
                System.out.println(Arrays.asList(rounds[round]));
                for(int match = 0; match < matchesPerRound; match++){
                    if(!rounds[round][match].equals("Bye")){
                        bw.write(rounds[round][match] + "\n");
                    }
                }
            }catch(IOException e){
                System.out.println(e);
            }finally{
                try{
                    if(bw!=null){
                        bw.close();
                    }
                    if(fw!=null){
                        fw.close();
                    }
                }catch(IOException e){
                    System.out.println(e);
                }
            }
        }
    }
}
