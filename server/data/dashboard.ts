"use server";

import { db } from "@/lib/db";
import { getUserById } from "./user";
import { AverageResolveTimeData, MaintenanceRequestData } from "@/app/(routes)/user/dashboard/page";
import { getAllMaintenanceTypes } from "./maintenance-type";

export const getMemberCount = async (
  primarySelection: string,
  selectedYear?: string,
  selectedMonth?: string
): Promise<number> => {
  let whereClause = {};

  // Filter by specific year
  if (primarySelection === 'year' && selectedYear) {
    const startDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
    whereClause = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };
  }

  // Filter by specific year and month
  else if (primarySelection === 'yearMonth' && selectedYear && selectedMonth) {
    const yearNum = parseInt(selectedYear, 10);
    const monthNum = parseInt(selectedMonth, 10);
  
    // Ensure month is in 'MM' format for the string
    const monthPadded = selectedMonth.padStart(2, '0');
  
    // Start of the month, note: Month is 1-indexed in this format
    const startDate = new Date(`${selectedYear}-${monthPadded}-01T00:00:00.000Z`);
    
    // End of the month: Calculate the last day by creating a new Date object
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
  
    whereClause = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };
  }
  // If 'all', whereClause remains an empty object, applying no filter

  const count = await db.personalInfo.count({
    where: whereClause,
  });

  return count;
};

  export const getHoaFunds = async () => {
    try {
      const hoa = await db.hoa.findFirst();
  
      return hoa?.funds;
    } catch {
      return 0;
    }
  };

  export const getViolations = async (
    primarySelection: string,
    selectedYear?: string,
    selectedMonth?: string
  ): Promise<number> => {
    let whereClause: {
      status: string;
      reasonToClose: string;
      createdAt?: {
        gte?: Date;
        lte?: Date;
      };
    } = {
      status: "CLOSED",
      reasonToClose: "Insufficient Evidence"
    };
  
    // Filter by specific year
    if (primarySelection === 'year' && selectedYear) {
      const startDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }
  
    // Filter by specific year and month
    else if (primarySelection === 'yearMonth' && selectedYear && selectedMonth) {
      const yearNum = parseInt(selectedYear, 10);
      const monthNum = parseInt(selectedMonth, 10) - 1; // Adjusting because JavaScript Date month is 0-indexed
    
      const startDate = new Date(yearNum, monthNum, 1);
      const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999); // End of the month
    
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }
    // If 'all', the createdAt condition is not added, but status: "CLOSED" remains
  
    try {
      const violationsCount = await db.violation.count({
        where: {
          createdAt: whereClause.createdAt,
          status: "CLOSED",
          reasonToClose: {
            not: "Insufficient Evidence"
          }
        }
      });
    
      return violationsCount;
    } catch {
      return 0;
    }
  };

  export const getDisputes = async (
    primarySelection: string,
    selectedYear?: string,
    selectedMonth?: string
  ): Promise<number> => {
    let whereClause: {
      status: string;
      reasonToClose: string;
      createdAt?: {
        gte?: Date;
        lte?: Date;
      };
    } = {
      status: "CLOSED", // Assuming you want to filter by CLOSED status
      reasonToClose: "Resolved"
    };
  
    // Filter by specific year
    if (primarySelection === 'year' && selectedYear) {
      const startDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }
  
    // Filter by specific year and month
    else if (primarySelection === 'yearMonth' && selectedYear && selectedMonth) {
      const yearNum = parseInt(selectedYear, 10);
      const monthNum = parseInt(selectedMonth, 10) - 1; // Adjusting because JavaScript Date month is 0-indexed
    
      const startDate = new Date(yearNum, monthNum, 1);
      const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999); // End of the month
    
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }
    // If 'all', the createdAt condition is not added, keeping the status filter
  
    try {
      const disputesCount = await db.dispute.count({
        where: {
          createdAt: whereClause.createdAt,
          status: "CLOSED",
          reasonToClose: "Resolved"
        }
      });
    
      return disputesCount;
    } catch (error) {
      console.error("Failed to fetch disputes count:", error);
      return 0;
    }
  };

  export const getFacilityReserves = async (
    primarySelection: string,
    selectedYear?: string,
    selectedMonth?: string
  ): Promise<number> => {
    let whereClause: {
      endTime?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};
  
    // Filter by specific year
    if (primarySelection === 'year' && selectedYear) {
      const startDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
      whereClause.endTime = {
        gte: startDate,
        lte: endDate,
      };
    }
  
    // Filter by specific year and month
    else if (primarySelection === 'yearMonth' && selectedYear && selectedMonth) {
      const yearNum = parseInt(selectedYear, 10);
      const monthNum = parseInt(selectedMonth, 10) - 1; // Adjusting because JavaScript Date month is 0-indexed
  
      const startDate = new Date(yearNum, monthNum, 1);
      const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999); // End of the month
  
      whereClause.endTime = {
        gte: startDate,
        lte: endDate,
      };
    }
  
    try {
      const reservesCount = await db.facilityReservation.count({
        where: whereClause
      });
  
      return reservesCount;
    } catch (error) {
      console.error("Failed to fetch facility reserves count:", error);
      return 0;
    }
  };

  export const getMaintenanceCompleted = async (
    primarySelection: string,
    selectedYear?: string,
    selectedMonth?: string
  ): Promise<number> => {
    let whereClause: {
      status: string;
      createdAt?: {
        gte?: Date;
        lte?: Date;
      };
    } = {
      status: "Completed", // Assuming you want to filter by CLOSED status
    };
  
    // Filter by specific year
    if (primarySelection === 'year' && selectedYear) {
      const startDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }
  
    // Filter by specific year and month
    else if (primarySelection === 'yearMonth' && selectedYear && selectedMonth) {
      const yearNum = parseInt(selectedYear, 10);
      const monthNum = parseInt(selectedMonth, 10) - 1; // Adjusting because JavaScript Date month is 0-indexed
    
      const startDate = new Date(yearNum, monthNum, 1);
      const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999); // End of the month
    
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }
    // If 'all', the createdAt condition is not added, keeping the status filter
  
    try {
      const maintenanceCompletedCount = await db.maintenanceRequest.count({
        where: {
          createdAt: whereClause.createdAt,
          status: "Completed",
        }
      });
    
      return maintenanceCompletedCount;
    } catch (error) {
      console.error("Failed to fetch disputes count:", error);
      return 0;
    }
  };

  export const getLastVoterTurnout = async (
    primarySelection: string,
    selectedYear?: string,
    selectedMonth?: string
  ): Promise<number> => {
    let whereClause: {
      createdAt?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};
  
    // Filter by specific year
    if (primarySelection === 'year' && selectedYear) {
      const startDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }
  
    // Filter by specific year and month
    else if (primarySelection === 'yearMonth' && selectedYear && selectedMonth) {
      const yearNum = parseInt(selectedYear, 10);
      const monthNum = parseInt(selectedMonth, 10) - 1; // Adjusting because JavaScript Date month is 0-indexed
  
      const startDate = new Date(yearNum, monthNum, 1);
      const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999); // End of the month
  
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }
  
    try {
      const uniqueUsers = await db.voteResponse.groupBy({
        by: ['userId'],
        where: whereClause,
      });
  
      const uniqueUserCount = uniqueUsers.length;
  
      return uniqueUserCount;
    } catch (error) {
      console.error("Failed to fetch unique user count:", error);
      return 0;
    }
  };


  export const getHoaTransactions = async (
    primarySelection: string,
    selectedYear?: string,
    selectedMonth?: string
  ) => {
    try {
      let whereClause: {
        dateIssued?: {
          gte?: Date;
          lte?: Date;
        };
      } = {};
  
      // Filter by specific year
      if (primarySelection === 'year' && selectedYear) {
        const startDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
        whereClause.dateIssued = {
          gte: startDate,
          lte: endDate,
        };
      }
  
      // Filter by specific year and month
      else if (primarySelection === 'yearMonth' && selectedYear && selectedMonth) {
        const yearNum = parseInt(selectedYear, 10);
        const monthNum = parseInt(selectedMonth, 10) - 1; // Adjusting because JavaScript Date month is 0-indexed
      
        const startDate = new Date(yearNum, monthNum, 1);
        const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999); // End of the month
        
        whereClause.dateIssued = {
          gte: startDate,
          lte: endDate,
        };
      }
      // If 'all', the createdAt condition is not added
  
      const transactions = await db.hoaTransaction.findMany({
        where: whereClause,
      });
  
      return transactions;
    } catch (error) {
      console.error("Failed to fetch HOA transactions:", error);
      return null;
    }
  };
  
  export const getViolationName = async (id: string) => {
    const violationType = await db.violationType.findUnique({
      where: {
        id: id,
      },
    });
    return violationType ? violationType.title : null;
  };

  export const getAllViolations = async (
    primarySelection: string,
    selectedYear?: string,
    selectedMonth?: string
  ) => {
    try {
      let whereClause = {};
  
      // Filter by specific year
      if (primarySelection === 'year' && selectedYear) {
        const startDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
        whereClause = {
          ...whereClause,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        };
      }
  
      // Filter by specific year and month
      else if (primarySelection === 'yearMonth' && selectedYear && selectedMonth) {
        const yearNum = parseInt(selectedYear, 10);
        const monthNum = parseInt(selectedMonth, 10) - 1; // Adjusting because JavaScript Date month is 0-indexed
      
        const startDate = new Date(yearNum, monthNum, 1);
        const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999); // End of the month
      
        whereClause = {
          ...whereClause,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        };
      }
      // If 'all', no additional createdAt filter is applied
  
      const violations = await db.violation.findMany({
        where: whereClause,
      });
      return violations;
    } catch (error) {
      console.error("Failed to fetch violations:", error);
      return null;
    }
  };

  export const getDisputeName = async (id: string) => {
    const disputeType = await db.disputeType.findUnique({
      where: {
        id: id,
      },
    });
    return disputeType ? disputeType.title : null;
  };

  export const getAllDisputes = async (
    primarySelection: string,
    selectedYear?: string,
    selectedMonth?: string
  ) => {
    try {
      let whereClause = {};
  
      // Filter by specific year
      if (primarySelection === 'year' && selectedYear) {
        const startDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
        whereClause = {
          ...whereClause,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        };
      }
  
      // Filter by specific year and month
      else if (primarySelection === 'yearMonth' && selectedYear && selectedMonth) {
        const yearNum = parseInt(selectedYear, 10);
        const monthNum = parseInt(selectedMonth, 10) - 1; // Adjusting because JavaScript Date month is 0-indexed
      
        const startDate = new Date(yearNum, monthNum, 1);
        const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999); // End of the month
      
        whereClause = {
          ...whereClause,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        };
      }
      // If 'all', no additional createdAt filter is applied
  
      const disputes = await db.dispute.findMany({
        where: whereClause,
      });
      return disputes;
    } catch (error) {
      console.error("Failed to fetch disputes:", error);
      return null;
    }
  };
  export const getDiscussionCount = async (
    primarySelection: string,
    selectedYear?: string,
    selectedMonth?: string
  ): Promise<number> => {
    const postType = "DISCUSSION";
    let whereClause: {
      type: string;
      createdAt?: {
        gte?: Date;
        lte?: Date;
      };
    } = {
      type: postType, // Always filter by discussion post type
    };
  
    // Filter by specific year
    if (primarySelection === 'year' && selectedYear) {
      const startDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }
  
    // Filter by specific year and month
    else if (primarySelection === 'yearMonth' && selectedYear && selectedMonth) {
      const yearNum = parseInt(selectedYear, 10);
      const monthNum = parseInt(selectedMonth, 10) - 1; // Adjusting because JavaScript Date month is 0-indexed
    
      const startDate = new Date(yearNum, monthNum, 1);
      const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999); // End of the month
    
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }
    // If 'all', the createdAt condition is not added, but type: "DISCUSSION" remains
  
    try {
      const postsCount = await db.post.count({
        where: {
          createdAt: whereClause.createdAt,
          type: "DISCUSSION"
        }
      });
    
      return postsCount;
    } catch (error) {
      console.error("Failed to fetch discussion count:", error);
      return 0;
    }
  };
  export const getBusinessCount = async (
    primarySelection: string,
    selectedYear?: string,
    selectedMonth?: string
  ): Promise<number> => {
    const postType = "BUSINESS";
    let whereClause: {
      type: string;
      createdAt?: {
        gte?: Date;
        lte?: Date;
      };
    } = {
      type: postType, // Always filter by business post type
    };
  
    // Filter by specific year
    if (primarySelection === 'year' && selectedYear) {
      const startDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }
  
    // Filter by specific year and month
    else if (primarySelection === 'yearMonth' && selectedYear && selectedMonth) {
      const yearNum = parseInt(selectedYear, 10);
      const monthNum = parseInt(selectedMonth, 10) - 1; // Adjusting because JavaScript Date month is 0-indexed
      
      const startDate = new Date(yearNum, monthNum, 1);
      const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999); // End of the month
      
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }
    // If 'all', the createdAt condition is not added, keeping type: "BUSINESS"
  
    try {
      const postsCount = await db.post.count({
        where: {
          createdAt: whereClause.createdAt,
          type: "BUSINESS"
        }
      });
    
      return postsCount;
    } catch (error) {
      console.error("Failed to fetch business posts count:", error);
      return 0;
    }
  };

  export const getPosts = async () => {
    try {
      const posts = await db.post.findMany();
  
      return posts;
    } catch {
      return null;
    }
  }

  export const getEventCount = async (
    primarySelection: string,
    selectedYear?: string,
    selectedMonth?: string
  ): Promise<number> => {
    let whereClause: {
      createdAt?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};
  
    // Filter by specific year
    if (primarySelection === 'year' && selectedYear) {
      const startDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }
  
    // Filter by specific year and month
    else if (primarySelection === 'yearMonth' && selectedYear && selectedMonth) {
      const yearNum = parseInt(selectedYear, 10);
      const monthNum = parseInt(selectedMonth, 10) - 1; // Adjusting because JavaScript Date month is 0-indexed
    
      const startDate = new Date(yearNum, monthNum, 1);
      const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999); // End of the month
      
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }
    // If 'all', the createdAt condition is not added
  
    try {
      const eventsCount = await db.events.count({
        where: {
          createdAt: whereClause.createdAt
        }
      });
    
      return eventsCount;
    } catch (error) {
      console.error("Failed to fetch event count:", error);
      return 0;
    }
  };

  export const countUniqueUsersWhoAnsweredPolls = async (
    primarySelection: string,
    selectedYear?: string,
    selectedMonth?: string
  ): Promise<number> => {
    try {
      let whereClause: {
        createdAt?: {
          gte?: Date;
          lte?: Date;
        };
      } = {};
  
      // Filter by specific year
      if (primarySelection === 'year' && selectedYear) {
        const startDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
        whereClause.createdAt = {
          gte: startDate,
          lte: endDate,
        };
      }
  
      // Filter by specific year and month
      else if (primarySelection === 'yearMonth' && selectedYear && selectedMonth) {
        const yearNum = parseInt(selectedYear, 10);
        const monthNum = parseInt(selectedMonth, 10) - 1; // Adjusting because JavaScript Date month is 0-indexed
      
        const startDate = new Date(yearNum, monthNum, 1);
        const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999); // End of the month
        
        whereClause.createdAt = {
          gte: startDate,
          lte: endDate,
        };
      }
      // If 'all', the createdAt condition is not added
  
      // Use the whereClause to filter responses based on the createdAt field
      const uniqueUserIds = await db.response.findMany({
        where: whereClause,
        select: {
          userId: true,
        },
        distinct: ['userId'],
      });
  
      // Count the number of unique userIds
      const uniqueUserCount = uniqueUserIds.length;
  
      return uniqueUserCount;
    } catch (error) {
      console.error("Error counting unique users who answered polls:", error);
      return 0;
    }
  };

  
export const getMaintenanceReqVolume = async (
  primarySelection: string,
  selectedYear?: string,
  selectedMonth?: string
) => {
  let whereClause = {};

  if (primarySelection === 'year' && selectedYear) {
    const startDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
    whereClause = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };
  } else if (primarySelection === 'yearMonth' && selectedYear && selectedMonth) {
    const yearNum = parseInt(selectedYear, 10);
    const monthNum = parseInt(selectedMonth, 10) - 1;

    const startDate = new Date(yearNum, monthNum, 1);
    const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);
    whereClause = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };
  }

  const requestVolume = await db.maintenanceRequest.findMany({
    where: whereClause,
  });

  return requestVolume;
}

export const fetchMaintenanceRequestData = async (
  primarySelection: string,
  selectedYear?: string,
  selectedMonth?: string
): Promise<MaintenanceRequestData[]> => {
  
  const types = await getAllMaintenanceTypes();

  const maintenanceRequests = await getMaintenanceReqVolume(
    primarySelection,
    selectedYear,
    selectedMonth
  );

  const groupedData: { [key: string]: MaintenanceRequestData } = {};

  maintenanceRequests.forEach((req) => {
    const key = req.type;
    if (!groupedData[key]) {
      groupedData[key] = {
        maintenanceType: types?.find((type) => type.id === req.type)?.title || req.type,
        pending: 0,
        completed: 0,
      };
    }
    if (req.status === 'Completed' || req.status === 'Closed') {
      groupedData[key].completed++;
    } else {
      groupedData[key].pending++;
    } 
  });

  return Object.values(groupedData);
};

export const getAverageResolveTime = async (
  primarySelection: string,
  selectedYear?: string,
  selectedMonth?: string
): Promise<AverageResolveTimeData[]> => {
  const types = await getAllMaintenanceTypes();

  const maintenanceRequests = await getMaintenanceReqVolume(
    primarySelection,
    selectedYear,
    selectedMonth
  );

  const filteredRequests = maintenanceRequests.filter((req) => req.status === "Completed" || req.status === "Closed")

  // Group requests by maintenance type and calculate average time to resolve
  const groupedData: { [key: string]: { totalDays: number; count: number } } = {};

  filteredRequests.forEach((req) => {
    if(req.finalReviewDate){
    const key = req.type;
    const timeToResolve = (req.finalReviewDate.getTime() - req.createdAt.getTime()) / (1000 * 3600 * 24); // in days

    if (!groupedData[key]) {
      groupedData[key] = { totalDays: 0, count: 0 };
    }

    groupedData[key].totalDays += timeToResolve;
    groupedData[key].count++;}
  });

  const result: AverageResolveTimeData[] = [];

  for (const key in groupedData) {
    if (groupedData.hasOwnProperty(key)) {
      const avgTime = groupedData[key].totalDays / groupedData[key].count;
      result.push({ maintenanceType: types?.find((type) => type.id === key)?.title || key, averageTimeToResolve: avgTime });
    }
  }

  console.log(result)

  return result;
};

export const getMonthlyReservationTrends = async (
  primarySelection: string,
  selectedYear?: string,
  selectedMonth?: string
): Promise<{ month: string, count: number, facilities: { [key: string]: number } }[]> => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - 5);

  const reservations = await db.facilityReservation.findMany({
    where: {
      endTime: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      endTime: true,
      Facility: {
        select: {
          name: true,
        },
      },
    },
  });

  interface MonthlyReservations {
    [key: string]: { count: number, facilities: { [key: string]: number } };
  }

  const monthlyReservations: MonthlyReservations = {};

  reservations.forEach((reservation) => {
    const month = new Date(reservation.endTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
    if (!monthlyReservations[month]) {
      monthlyReservations[month] = { count: 0, facilities: {} };
    }
    monthlyReservations[month].count++;
    const facilityName = reservation.Facility.name;
    if (!monthlyReservations[month].facilities[facilityName]) {
      monthlyReservations[month].facilities[facilityName] = 0;
    }
    monthlyReservations[month].facilities[facilityName]++;
  });

  const result = Object.keys(monthlyReservations).map((month) => ({
    month,
    count: monthlyReservations[month].count,
    facilities: monthlyReservations[month].facilities,
  }));

  return result;
};

export const getTopFacilitiesReserved = async (
  primarySelection: string,
  selectedYear?: string,
  selectedMonth?: string
): Promise<{ facilityName: string, reservationCount: number }[]> => {
  // Define startDate and endDate based on selection
  const endDate = new Date();
  const startDate = new Date();
  
  if (primarySelection === 'year') {
    startDate.setFullYear(Number(selectedYear), 0, 1);
    endDate.setFullYear(Number(selectedYear), 11, 31);
  } else if (primarySelection === 'yearMonth') {
    startDate.setFullYear(Number(selectedYear), Number(selectedMonth) - 1, 1);
    endDate.setFullYear(Number(selectedYear), Number(selectedMonth), 0);
  } else {
    startDate.setMonth(endDate.getMonth() - 5);
  }

  // Fetch the reservations grouped by facilityId within the date range
  const reservations = await db.facilityReservation.groupBy({
    by: ['facilityId'],
    _count: {
      facilityId: true,
    },
    where: {
      endTime: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Fetch the facility names for each facilityId
  const facilities = await db.facility.findMany({
    where: {
      id: {
        in: reservations.map(reservation => reservation.facilityId),
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  // Map the facility names to the reservation counts
  const result = reservations.map(reservation => ({
    facilityName: facilities.find(facility => facility.id === reservation.facilityId)?.name || 'Unknown Facility',
    reservationCount: reservation._count.facilityId,
  }));

  return result;
};