"use client";

import { useState, useEffect } from "react";
import DataTable from "./Tablecomponents/data-table";

// Define a history entry interface
interface PriceHistoryEntry {
  date: string;
  purchaseRate: number;
  saleRate: number;
  previousPurchaseRate?: number;
  previousSaleRate?: number;
  purchaseRateChange?: number;
  saleRateChange?: number;
  purchasePercentageChange?: number;
  salePercentageChange?: number;
  associate?: string;
  department?: string;
  reason?: string;
  fromDate?: string;
  toDate?: string | null;
  _id?: string;
}

interface Test {
  id: string | number;
  _id: string | number;
  name: string;
  email?: string;
  purchaseRate: number;
  saleRate: number;
  originalPurchaseRate?: number;
  originalSaleRate?: number;
  department?: string;
  associate?: string;
  date?: string;
  history?: PriceHistoryEntry[];
  testId?: string;
  currentPurchasePrice?: number;
  currentSaleRate?: number;
  currentPercentage?: number;
  currentFromDate?: string;
  currentToDate?: string | null;
}

interface Props {
  data: Test[];
  setUpdatedtests: (tests: Test[]) => void;
  setPercentagevalue: (value: number) => void;
  conflictchecks?: Array<{
    type: "associate" | "department";
    value: number;
    isPercentage: boolean;
    _id?: string | number;
  }>;
  conflictData?: any;
  setSelectedAssociate?: (associate: any) => void;
  onUpdateTests?: (
    testsToUpdate: Test[],
    discountPercentage: number
  ) => Promise<void>;
}

const columns: Array<{ key: keyof Test; header: string }> = [
  { key: "name", header: "Name" },
  { key: "date", header: "Effective Date" },
  { key: "purchaseRate", header: "Purchase Rate" },
  { key: "saleRate", header: "Sale Rate" },
];

const fields: Array<{ key: keyof Test; label: string; type: string }> = [
  { key: "name", label: "Name", type: "text" },
  { key: "date", label: "Date", type: "date" },
  { key: "purchaseRate", label: "Purchase Rate", type: "number" },
  { key: "saleRate", label: "Sale Rate", type: "number" },
];

export default function Tablecomponent({
  data,
  setUpdatedtests,
  setPercentagevalue,
  conflictchecks,
  setSelectedAssociate,
  conflictData,
  onUpdateTests,
}: Props) {
  const [users, setUsers] = useState<Test[]>([]);
  const [selectedItems, setSelectedItems] = useState<Test[]>([]);
  const [bulkEditPercentage, setBulkEditPercentage] = useState<number>(0);
  const [showConflictModal, setShowConflictModal] = useState<boolean>(false);
  const [conflictItems, setConflictItems] = useState<
    { item: Test; selected: boolean }[]
  >([]);

  // Helper function to create a history entry
  const createHistoryEntry = (
    test: Test,
    newPurchaseRate: number,
    newSaleRate: number,
    reason: string
  ): PriceHistoryEntry => {
    // Find previous rates (either from latest history or current rates)
    const prevHistory = test.history && test.history.length > 0 ? test.history[0] : null;
    const previousPurchaseRate = prevHistory ? prevHistory.purchaseRate : test.originalPurchaseRate || 0;
    const previousSaleRate = prevHistory ? prevHistory.saleRate : test.originalSaleRate || 0;
    
    // Calculate absolute changes
    const purchaseRateChange = newPurchaseRate - previousPurchaseRate;
    const saleRateChange = newSaleRate - previousSaleRate;
    
    // Calculate percentage changes (avoid division by zero)
    const purchasePercentageChange = previousPurchaseRate !== 0 
      ? (purchaseRateChange / previousPurchaseRate) * 100 
      : newPurchaseRate > 0 ? 100 : 0;
    
    const salePercentageChange = previousSaleRate !== 0 
      ? (saleRateChange / previousSaleRate) * 100 
      : newSaleRate > 0 ? 100 : 0;
    
    return {
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      purchaseRate: newPurchaseRate,
      saleRate: newSaleRate,
      previousPurchaseRate,
      previousSaleRate,
      purchaseRateChange,
      saleRateChange,
      purchasePercentageChange,
      salePercentageChange,
      associate: test.associate,
      department: test.department,
      reason,
      _id: `history_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    };
  };

  // Helper to add history to a test
  const addHistoryToTest = (
    test: Test,
    newPurchaseRate: number,
    newSaleRate: number,
    reason: string
  ): Test => {
    // Only create history if rates actually changed or associate changed
    if (
      newPurchaseRate === test.purchaseRate && 
      newSaleRate === test.saleRate &&
      reason !== "Associate Changed" &&
      !reason.includes("Associate Changed")
    ) {
      return test;
    }
    
    const newEntry = createHistoryEntry(test, newPurchaseRate, newSaleRate, reason);
    
    return {
      ...test,
      history: [newEntry, ...(test.history || [])]
    };
  };

  useEffect(() => {
    // Initialize with original prices and ensure all numeric values are valid
    console.log("Data received:", data);
    
    if (!data || data.length === 0) {
      setUsers([]);
      return;
    }

    const usersWithOriginal = data.map((user) => {
      const testData = conflictData?.tests?.find((test: any) => 
        test.testId?._id === user._id || 
        test.testId === user._id
      );
      
      // Track if associate has changed
      const historyArray = Array.isArray(user.history) ? user.history : [];
      const previousAssociate = historyArray.length > 0 
        ? historyArray[historyArray.length - 1].associate 
        : undefined;
      
      const associateChanged = previousAssociate !== undefined && 
                               previousAssociate !== user.associate;
      
      // Ensure purchaseRate and saleRate are valid numbers, prefer currentPurchasePrice if available
      const purchaseRate = user.currentPurchasePrice || testData?.currentPurchasePrice || (typeof user.purchaseRate === 'number' && !isNaN(user.purchaseRate) 
        ? user.purchaseRate 
        : 0);
      
      const saleRate = user.currentSaleRate || testData?.currentSaleRate || (typeof user.saleRate === 'number' && !isNaN(user.saleRate) 
        ? user.saleRate 
        : 0);
      
      // Ensure originalPurchaseRate and originalSaleRate are valid
      const originalPurchaseRate = typeof user.originalPurchaseRate === 'number' && !isNaN(user.originalPurchaseRate) 
        ? user.originalPurchaseRate 
        : purchaseRate;
      
      const originalSaleRate = typeof user.originalSaleRate === 'number' && !isNaN(user.originalSaleRate) 
        ? user.originalSaleRate 
        : saleRate;
      
      const formattedFromDate = user.currentFromDate || testData?.currentFromDate
        ? new Date(user.currentFromDate || testData?.currentFromDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          }) 
        : undefined;
      
      // Convert history data if it exists or initialize it
      let processedHistory: PriceHistoryEntry[] = [];
      
      // Use history from either the user object or the testData
      const historyData = user.history || testData?.history || [];
      
      if (historyData && historyData.length > 0) {
        // Map existing history to match our interface
        processedHistory = historyData.map((entry: any) => {
          // Handle different history formats
          const fromDate = entry.fromDate || entry.date;
          const entryDate = fromDate 
            ? new Date(fromDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              }) 
            : "";
          
          return {
            // Original fields required by data-table component
            date: entryDate,
            purchaseRate: entry.purchasePrice || entry.purchaseRate || 0,
            saleRate: entry.saleRate || 0,
            previousPurchaseRate: entry.previousPurchaseRate || 0,
            previousSaleRate: entry.previousSaleRate || 0,
            purchaseRateChange: entry.purchaseRateChange || 0,
            saleRateChange: entry.saleRateChange || 0,
            purchasePercentageChange: entry.purchasePercentageChange || 0,
            salePercentageChange: entry.salePercentageChange || 0,
            associate: entry.associate || user.associate,
            department: entry.department || user.department,
            reason: entry.reason || "Historical Rate",
            
            // Keep the original fields
            fromDate: entry.fromDate || entry.date,
            toDate: entry.toDate,
            _id: entry._id || `history_${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${Math.floor(Math.random() * 1000)}`
          };
        });
        
        // Sort history by date (newest first if fromDate exists, otherwise by date)
        processedHistory.sort((a, b) => {
          const dateA = a.fromDate ? new Date(a.fromDate).getTime() : (a.date ? new Date(a.date).getTime() : 0);
          const dateB = b.fromDate ? new Date(b.fromDate).getTime() : (b.date ? new Date(b.date).getTime() : 0);
          return dateB - dateA;
        });
        
        console.log("Processed history:", processedHistory);
      } 
      // If no history exists and we have current price data, create an initial entry
      else if (testData?.currentPurchasePrice || user.currentPurchasePrice) {
        const currentPrice = testData?.currentPurchasePrice || user.currentPurchasePrice || 0;
        const currentSaleRate = testData?.currentSaleRate || user.currentSaleRate || 0;
        
        // Previous values to compare (use original values if available or default to zero)
        const prevPurchaseRate = user.originalPurchaseRate || user.purchaseRate || 0;
        const prevSaleRate = user.originalSaleRate || user.saleRate || 0;
        
        // Calculate rate changes
        const purchaseRateChange = currentPrice - prevPurchaseRate;
        const saleRateChange = currentSaleRate - prevSaleRate;
        
        // Calculate percentage changes with safeguards for division by zero
        const purchasePercentageChange = prevPurchaseRate !== 0 
          ? (purchaseRateChange / prevPurchaseRate) * 100 
          : currentPrice > 0 ? 100 : 0;
        
        const salePercentageChange = prevSaleRate !== 0 
          ? (saleRateChange / prevSaleRate) * 100 
          : currentSaleRate > 0 ? 100 : 0;
        
        const now = new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        });
        
        processedHistory.push({
          // Original fields required by data-table component
          date: now,
          purchaseRate: currentPrice,
          saleRate: currentSaleRate,
          associate: user.associate,
          department: user.department,
          reason: "Current Rate",
          
          // New fields for extended functionality
          previousPurchaseRate: prevPurchaseRate,
          previousSaleRate: prevSaleRate,
          purchaseRateChange,
          saleRateChange,
          purchasePercentageChange,
          salePercentageChange,
          fromDate: testData?.currentFromDate || user.currentFromDate,
          toDate: testData?.currentToDate || user.currentToDate,
          _id: `initial_${user._id || testData?.testId}_${Date.now()}`
        });
      }
      
      // Add entry for associate change if needed
      if (associateChanged) {
        // Find previous rates for calculating changes
        const prevHistory = processedHistory.length > 0 ? processedHistory[0] : null;
        const prevPurchaseRate = prevHistory ? prevHistory.purchaseRate : user.originalPurchaseRate || 0;
        const prevSaleRate = prevHistory ? prevHistory.saleRate : user.originalSaleRate || 0;
        
        // Calculate changes
        const purchaseRateChange = purchaseRate - prevPurchaseRate;
        const saleRateChange = saleRate - prevSaleRate;
        
        // Calculate percentage changes (avoid division by zero)
        const purchasePercentageChange = prevPurchaseRate !== 0 
          ? (purchaseRateChange / prevPurchaseRate) * 100 
          : purchaseRate > 0 ? 100 : 0;
        
        const salePercentageChange = prevSaleRate !== 0 
          ? (saleRateChange / prevSaleRate) * 100 
          : saleRate > 0 ? 100 : 0;
        
        const associateChangeEntry: PriceHistoryEntry = {
          date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          }),
          purchaseRate,
          saleRate,
          previousPurchaseRate: prevPurchaseRate,
          previousSaleRate: prevSaleRate,
          purchaseRateChange,
          saleRateChange,
          purchasePercentageChange,
          salePercentageChange,
          associate: user.associate,
          department: user.department,
          reason: `Associate Changed: ${previousAssociate} → ${user.associate}`,
          _id: `associate_change_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        };
        
        processedHistory.push(associateChangeEntry);
        
        // Re-sort after adding new entry
        processedHistory.sort((a, b) => {
          const dateA = a.fromDate ? new Date(a.fromDate).getTime() : (a.date ? new Date(a.date).getTime() : 0);
          const dateB = b.fromDate ? new Date(b.fromDate).getTime() : (b.date ? new Date(b.date).getTime() : 0);
          return dateB - dateA;
        });
      }
      
      return {
        ...user,
        id: user._id, // Ensure id is set
        purchaseRate, // Explicitly set validated purchaseRate
        saleRate, // Explicitly set validated saleRate
        date: formattedFromDate,
        originalPurchaseRate, // Set validated originalPurchaseRate
        originalSaleRate, // Set validated originalSaleRate
        history: processedHistory,
        // Pass through any test-specific data
        testId: user.testId || testData?.testId?._id || testData?.testId,
        currentPurchasePrice: user.currentPurchasePrice || testData?.currentPurchasePrice,
        currentSaleRate: user.currentSaleRate || testData?.currentSaleRate,
        currentPercentage: user.currentPercentage || testData?.currentPercentage,
        currentFromDate: user.currentFromDate || testData?.currentFromDate,
        currentToDate: user.currentToDate || testData?.currentToDate
      };
    });
    
    console.log("Processed users with rates:", usersWithOriginal);
    setUsers(usersWithOriginal || []);
  }, [data, conflictData]);

  useEffect(() => {
    // Ensure we pass validated data to parent
    if (users.length > 0) {
      console.log("Sending updated tests to parent:", users);
      setUpdatedtests(users);
    }
  }, [users, setUpdatedtests]);

  const handleAdd = (newUser: Test) => {
    const newId = Math.max(...users.map((u) => Number(u._id)), 0) + 1;
    
    // Ensure numeric values are valid
    const purchaseRate = typeof newUser.purchaseRate === 'number' && !isNaN(newUser.purchaseRate) 
      ? newUser.purchaseRate : 0;
    const saleRate = typeof newUser.saleRate === 'number' && !isNaN(newUser.saleRate) 
      ? newUser.saleRate : 0;
    
    // Create initial history
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    
    const initialHistory: PriceHistoryEntry[] = [{
      date: today,
      purchaseRate,
      saleRate,
      previousPurchaseRate: 0,
      previousSaleRate: 0,
      purchaseRateChange: purchaseRate,
      saleRateChange: saleRate,
      purchasePercentageChange: purchaseRate > 0 ? 100 : 0,
      salePercentageChange: saleRate > 0 ? 100 : 0,
      associate: newUser.associate,
      department: newUser.department,
      reason: "Test Created",
      _id: `initial_${newId}_${Date.now()}`
    }];
    
    setUsers((prev) => [...prev, { 
      ...newUser, 
      _id: newId, 
      id: newId,
      purchaseRate,
      saleRate,
      originalPurchaseRate: purchaseRate,
      originalSaleRate: saleRate,
      history: initialHistory
    }]);
  };

  const handleDelete = (usersToDelete: Test[]) => {
    setUsers((prev) =>
      prev.filter((user) => !usersToDelete.some((u) => u._id === user._id))
    );
  };

  const handleEdit = (editedUser: Test) => {
    // Ensure numeric values are valid
    const purchaseRate = typeof editedUser.purchaseRate === 'number' && !isNaN(editedUser.purchaseRate) 
      ? editedUser.purchaseRate : 0;
    const saleRate = typeof editedUser.saleRate === 'number' && !isNaN(editedUser.saleRate) 
      ? editedUser.saleRate : 0;
    
    setUsers((prev) => {
      return prev.map((user) => {
        if (user._id === editedUser._id) {
          // Add history entry if rates changed
          const updatedUser = addHistoryToTest(
            user, 
            purchaseRate, 
            saleRate, 
            "Manual Edit"
          );
          
          return {
            ...updatedUser,
            purchaseRate,
            saleRate
          };
        }
        return user;
      });
    });
  };

  const handleBulkEdit = (discountPercentage: number, updatedItemsFromConflict?: Test[]) => {
    // Store the discount percentage for parent component
    setPercentagevalue(discountPercentage);
    
    // If we have updated items from conflict resolution, use those directly
    if (updatedItemsFromConflict && updatedItemsFromConflict.length > 0) {
      console.log("Applying updates from conflict resolution:", updatedItemsFromConflict);
      
      // Create a map for easier lookup
      const updatedItemsMap = new Map(
        updatedItemsFromConflict.map(item => [item._id, item])
      );
      
      // Update the users state with the new values while preserving other users
      setUsers(prevUsers => 
        prevUsers.map(user => {
          const updatedItem = updatedItemsMap.get(user._id);
          if (updatedItem) {
            // Format date if needed
            const testData = conflictData?.tests?.find((test: any) => test.testId?._id === user._id);
            const formattedDate = testData?.date
              ? new Date(testData.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })
              : user.date;
            
            // Ensure numeric values are valid numbers, not NaN
            const purchaseRate = typeof updatedItem.purchaseRate === 'number' && !isNaN(updatedItem.purchaseRate) 
              ? updatedItem.purchaseRate : (user.purchaseRate || 0);
            
            const saleRate = typeof updatedItem.saleRate === 'number' && !isNaN(updatedItem.saleRate) 
              ? updatedItem.saleRate : (user.saleRate || 0);
            
            // Check if associate has changed
            const associateChanged = updatedItem.associate !== user.associate;
            const reasonSuffix = associateChanged ? 
              ` (Associate Changed: ${user.associate || 'None'} → ${updatedItem.associate || 'None'})` : 
              '';
            
            console.log(`Updated item ${user.name || user._id}: Purchase rate ${user.purchaseRate} → ${purchaseRate}, Sale rate ${user.saleRate} → ${saleRate}`);
            
            // Add entry to history with associate change noted if applicable
            const updatedUser = addHistoryToTest(
              user,
              purchaseRate,
              saleRate,
              `Conflict Resolution${reasonSuffix}`
            );
            
            return {
              ...updatedUser,
              purchaseRate,
              saleRate,
              date: formattedDate,
              associate: updatedItem.associate,
              department: updatedItem.department,
              // Keep original rates for future percentage calculations
              originalPurchaseRate: user.originalPurchaseRate || user.purchaseRate || 0,
              originalSaleRate: user.originalSaleRate || user.saleRate || 0,
            };
          }
          return user;
        })
      );
    } 
    // Otherwise apply percentage discount to selected items
    else if (discountPercentage > 0) {
      const updatedUsers = users.map((user) => {
        if (selectedItems.some((selected) => selected?._id === user?._id)) {
          // Ensure we have valid original rates to calculate from
          const originalPurchaseRate = typeof user.originalPurchaseRate === 'number' && !isNaN(user.originalPurchaseRate) 
            ? user.originalPurchaseRate : (user.purchaseRate || 0);
          
          const originalSaleRate = typeof user.originalSaleRate === 'number' && !isNaN(user.originalSaleRate) 
            ? user.originalSaleRate : (user.saleRate || 0);
          
          const purchaseDiscount = originalPurchaseRate * (discountPercentage / 100);
          const saleDiscount = originalSaleRate * (discountPercentage / 100);
          
          const newPurchaseRate = Math.ceil(originalPurchaseRate - purchaseDiscount);
          const newSaleRate = Math.ceil(originalSaleRate - saleDiscount);

          console.log(`Applied discount to ${user.name || user._id}: Purchase rate ${user.purchaseRate} → ${newPurchaseRate}, Sale rate ${user.saleRate} → ${newSaleRate}`);

          const testData = conflictData?.tests?.find((test: any) => test.testId?._id === user._id);
          const formattedDate = testData?.date
            ? new Date(testData.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })
            : user.date || new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              });
          
          // Add history entry
          const updatedUser = addHistoryToTest(
            user,
            newPurchaseRate,
            newSaleRate,
            `${discountPercentage}% Discount Applied`
          );

          return {
            ...updatedUser,
            purchaseRate: newPurchaseRate,
            saleRate: newSaleRate,
            date: formattedDate,
            originalPurchaseRate, // Preserve original purchase rate
            originalSaleRate, // Preserve original sale rate
          };
        }
        return user;
      });

      setUsers(updatedUsers);
    }
    
    // If parent provided an update handler, call it with selected items and percentage
    if (onUpdateTests && selectedItems.length > 0) {
      onUpdateTests(selectedItems, discountPercentage)
        .catch(err => console.error("Error updating tests:", err));
    }
  };

  return (
    <main className="container">
      <DataTable
        data={users}
        columns={columns}
        fields={fields}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onBulkEdit={handleBulkEdit}
        onDelete={handleDelete}
        setSelectedAssociate={setSelectedAssociate}
        itemsPerPage={10}
        selectedItems={selectedItems}
        onSelectedItemsChange={setSelectedItems}
        // @ts-ignore - conflictchecks is a valid prop that needs to be passed through for conflict checking functionality
        conflictchecks={conflictchecks}
      />
    </main>
  );
}
