/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import static java.lang.Math.max;
import static java.lang.Math.min;

/**
 *
 * @author User
 */
public class PartA {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        // TODO code application logic here
        Point2D a = new Point2D(3,4);
        Point2D b = new Point2D(5,6);
        Point2D c = new Point2D(7,8);
        Point2D d = new Point2D(2,5);
        Point2D[] points = new Point2D[4];
        points[0] = c;
        points[1] = a;
        points[2] = b;
        points[3] = d;
        //For question 1
        System.out.println(a.distanceFromPoint(new Point2D(0,0)));
        //For question 2
        sortPoints(points);
        for(Point2D p: points){
            System.out.format("%d, %d", p.x, p.y);
        }
        System.out.println();
        //For question 3
        System.out.println(isCollinear(a,b,d));
        System.out.println(isAntiClockwise(a,b,d));
        //For question 4
        System.out.println(isIntersect(a,b,c,d));
        //For question 5
        Point2D[] randPoly = new Point2D[] {
            new Point2D(0, 0),
            new Point2D(4, 0),
            new Point2D(4, 4),
            new Point2D(2, 2),
            new Point2D(0, 4),
        };
        System.out.println(pointInPolygon(randPoly, new Point2D(3,4)));

    }
    // Sorting points
    static private void sortPoints(Point2D[] points){
        quickSort(points, 0, points.length-1);

    }

    static private void quickSort(Point2D[] points, int low, int high){
        if(low < high){
            int pivot = partition(points, low, high);
            quickSort(points, low, pivot - 1);
            quickSort(points, pivot + 1, high);
        }
    }

    static private int partition(Point2D[] points, int low, int high){
        Point2D pivot = points[high];
        Point2D origin = new Point2D(0,0);
        int i = low - 1;
        for(int j = low; j < high; j++){
            // Compares distance from origin
            if(points[j].distanceFromPoint(origin) <= pivot.distanceFromPoint(origin)){
                i++;
                Point2D temp = points[i];
                points[i] = points[j];
                points[j] = temp;
            }
        }
        Point2D temp = points[i+1];
        points[i+1] = points[high];
        points[high] = temp;
        return i+1;
    }

    //Check orientation of points
    static private int twiceSignedArea(Point2D a, Point2D b, Point2D c){
        int result = (b.x-a.x)*(c.y-a.y) - (b.y-a.y)*(c.x-a.x);
        if(result > 0){
            return 1;  // Anti-clockwise
        }
        else if(result < 0){
            return 2;  // Clockwise
        }
        else return 3; // Collinear
    }

    static private boolean isAntiClockwise(Point2D a, Point2D b, Point2D c){
        return twiceSignedArea(a,b,c) == 1;
    }

    static private boolean isCollinear(Point2D a, Point2D b, Point2D c){
        return twiceSignedArea(a,b,c) == 3;
    }

    //Check if 2 line segments intersect

    static private boolean isIntersect(Point2D a1, Point2D a2, Point2D b1, Point2D b2){
        int orient1 = twiceSignedArea(a1, a2, b1);
        int orient2 = twiceSignedArea(a1, a2, b2);
        int orient3 = twiceSignedArea(b1, b2, a1);
        int orient4 = twiceSignedArea(b1, b2, a2);

        if(orient1 != orient2 && orient3 != orient4){
            return true;
        }
        if(orient1 == 3 && onLineSegment(a1, a2, b1)){
            return true;
        }
        if(orient2 == 3 && onLineSegment(a1, a2, b2)){
            return true;
        }
        if(orient3 == 3 && onLineSegment(b1, b2, a1)){
            return true;
        }
        if(orient4 == 3 && onLineSegment(b1, b2, a2)){
            return true;
        }
        return false;
    }
    static private boolean onLineSegment(Point2D a, Point2D b, Point2D c){
        return (c.x <= max(a.x,b.x) && c.x >= min(a.x,b.x) && c.y <= max(a.y,b.y) && c.y >= min(a.y,b.y));
    }

    // Check if point is in polygon
    static private boolean pointInPolygon(Point2D[] polygonPoints, Point2D p){
        int xMax, xMin, yMax, yMin;
        //To initialise
        xMax = polygonPoints[0].x;
        xMin = polygonPoints[0].x;
        yMax = polygonPoints[0].y;
        yMin = polygonPoints[0].y;
        // Set bounding box for easy checks
        for (Point2D polygonPoint : polygonPoints) {
            if (polygonPoint.x < xMin) {
                xMin = polygonPoint.x;
            }
            if (polygonPoint.x > xMax) {
                xMax = polygonPoint.x;
            }
            if (polygonPoint.y < yMin) {
                yMin = polygonPoint.y;
            }
            if (polygonPoint.y > yMax) {
                yMax = polygonPoint.y;
            }
            if (polygonPoint.x == p.x && polygonPoint.y == p.y){
                return true;     // If the point is a point defined by the polygon, count that as in the polygon..
            }
        }

        //Basic check
        if(p.x < xMin || p.x > xMax || p.y < yMin || p.y > yMax){
            return false;
        }
        Point2D pointOutsidePoly = new Point2D(xMin - 1, 0);
        int noOfIntersects = 0;
        for(int i = 0; i < polygonPoints.length; i++){
            if(i == polygonPoints.length - 1){
                if(isIntersect(polygonPoints[i], polygonPoints[0], pointOutsidePoly, p)){
                    noOfIntersects++;
                    // If point found on the edges of polygon, return true
                    if(isCollinear(polygonPoints[i], polygonPoints[0], p) && onLineSegment(polygonPoints[i], polygonPoints[0], p)){
                        return true;
                    }
                }
            }
            else{
                if(isIntersect(polygonPoints[i], polygonPoints[i+1], pointOutsidePoly, p)){
                    noOfIntersects++;
                    if(isCollinear(polygonPoints[i], polygonPoints[0], p) && onLineSegment(polygonPoints[i], polygonPoints[i+1], p)){
                        return true;
                    }
                }
            }
        }
        return noOfIntersects % 2 == 1;
    }
}
