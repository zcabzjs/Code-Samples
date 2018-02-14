/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import static java.lang.Math.sqrt;

/**
 *
 * @author User
 */
public class Point2D {
    public int x;
    public int y;

    public Point2D(int x, int y){
        this.x = x;
        this.y = y;
    }
    // For question 1
    public double distanceFromPoint(Point2D p){
        return sqrt((p.x-x)*(p.x-x) + (p.y-y)*(p.y-y));
    }
}
