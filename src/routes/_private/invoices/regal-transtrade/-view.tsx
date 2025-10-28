import { AnyType, ModalStateType } from "@/lib/types"
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'
import { invoices } from "@/lib/db/schema"
import { formatCurrency, formatDate, formatMonth } from "@/lib/utils";
import { endOfMonth, startOfMonth } from "date-fns";

const Header = () => {
  return (
    <View style={{
      textAlign: "center",
      paddingBottom: 20,
      borderBottom: "1px solid #000",
    }}>
      <View>
        <Text style={{
          fontSize: 15,
          fontWeight: 700,
        }}>Regal TransTrade (PVT) LTD.</Text>
      </View>
    </View>
  )
}
const Footer = () => {
  return (
    <View style={{
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
      textAlign: "center",
    }}>
      <Text style={{
        borderBottom: "1px solid #000",
        paddingHorizontal: 40,
        paddingBottom: 20,
        fontSize: 11,
      }}>
        Kindly Arrange The Payment At Your Earliest. Please Make All Payment Through A/C Payee Cheque Only In Favour Of Regal TransTrade (PVT) LTD.
      </Text>
      <Text style={{
        fontSize: 10,
        marginTop: 20,
      }}>1183/1262, F.M.S Waquf Estate Building, South Halishahar, CEPZ Approach Road, Bandar, Chittagong</Text>
      <Text style={{
        fontSize: 8,
        marginTop: 5,
      }}>Mobile: 01681121850, 01814659746</Text>
    </View>
  )
}

export default function InvoiceView({ modal }: {
  modal: ModalStateType,
  // setModal: (state: ModalStateType) => void
}) {
  const styles = StyleSheet.create({
    page: {
      fontSize: 10,
      padding: 20,
      lineHeight: 1.5,
    },
    table: {
      border: "1px solid #000",
      borderBottom: "none",
      marginTop: 10,
    },
    tableRow: {
      flexDirection: "row",
      borderBottom: "1px solid #000",
    },
    tableHeader: {
      backgroundColor: "#f5f5f5",
      fontWeight: 700,
    },
    cell: {
      padding: 6,
      paddingBottom: 3,
      borderRight: "1px solid #000",
    },
    col1: { width: "8%", textAlign: "center", borderLeft: "none" },
    col2: { width: "40%" },
    col3: { width: "12%", textAlign: "right" },
    col4: { width: "20%", textAlign: "right" },
    col5: { width: "20%", textAlign: "right", borderRight: "none" },
  });

  return (
    // <ModalComponent variant="default" options={{
    //   header: "Invoice Details",
    //   isOpen: modal?.isOpen,
    //   onClose: () => {
    //     setModal(null)
    //   },
    //   size: "full"
    // }}>
    //   {(props) => (
        // <PDFViewer width="100%" height={842} showToolbar={false}>
          <Document>
            <Page size="A4" style={styles.page} wrap>
              <Header />

              <View style={{
                marginTop: 10,
                paddingTop: 10,
                marginBottom: 10,
                textAlign: "center",
              }}>
                <Text style={{
                  fontSize: 12,
                  fontWeight: 700,
                }}>Summary Statement for the Month of {formatMonth(modal?.item?.metadata?.to)}</Text>
              </View>

              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}>
                <View style={{
                  width: "48%",
                }}>
                  <Text style={{ fontWeight: 700 }}>Bill To:</Text>
                  <Text>Executive Director</Text>
                  <Text>{modal?.item?.customer?.name}</Text>
                  <Text>{modal?.item?.customer?.address}</Text>
                </View>

                <View style={{
                  width: "48%",
                  textAlign: "right",
                }}>
                  <Text style={{ fontWeight: 700 }}>Invoice Details</Text>
                  <Text>Bill No: #{modal?.item?.number}</Text>
                  <Text>Billing Cycle: {formatDate(startOfMonth(modal?.item?.metadata?.from))} to {formatDate(endOfMonth(modal?.item?.metadata?.to))}</Text>
                  <Text>Invoice Date: {formatDate(modal?.item?.date)}</Text>
                </View>
              </View>

              <Text style={{
                fontWeight: 700,
                textAlign: "center",
                marginTop: 10
              }}>{modal?.item?.metadata?.invoiceItems?.title}</Text>

              {/* Items table */}
              <View style={styles.table}>
                {/* Header row */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.cell, styles.col1]}>SL</Text>
                  <Text style={[styles.cell, styles.col2]}>Particulars</Text>
                  <Text style={[styles.cell, styles.col3]}>Quantity</Text>
                  <Text style={[styles.cell, styles.col4]}>Unit Price</Text>
                  <Text style={[styles.cell, styles.col5]}>Total</Text>
                </View>

                {Object.values(modal?.item?.metadata?.invoiceItems?.items)?.map((item: AnyType, index: number) => (
                  <View style={styles.tableRow} key={index}>
                    <Text style={[styles.cell, styles.col1]}>{index+1}</Text>
                    <Text style={[styles.cell, styles.col2]}>{item?.particulars}</Text>
                    <Text style={[styles.cell, styles.col3]}>{item?.quantity}</Text>
                    <Text style={[styles.cell, styles.col4]}>{formatCurrency(Number(item?.unitPrice))}</Text>
                    <Text style={[styles.cell, styles.col5]}>{formatCurrency(Number(item?.total))}</Text>
                  </View>
                ))}
                <View style={styles.tableRow}>
                  <Text style={[styles.cell, { width: "80%", textAlign: "center" }]}>Total</Text>
                  <Text style={[styles.cell, styles.col5]}>{formatCurrency(Number(modal?.item?.amount))}</Text>
                </View>
              </View>

              <Footer />
            </Page>
            <Page size="A4" style={styles.page} wrap>
              <Header />

              <Text style={{
                fontWeight: 700,
                textAlign: "center",
                marginTop: 10
              }}>{modal?.item?.metadata?.invoiceFuelItems?.title}</Text>

              {/* Items table */}
              <View style={styles.table}>
                {/* Header row */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.cell, styles.col1]}>SL</Text>
                  <Text style={[styles.cell, styles.col2]}>Depot Name</Text>
                  <Text style={[styles.cell, styles.col3]}>Fuel/Trip</Text>
                  <Text style={[styles.cell, styles.col4]}>Trips</Text>
                  <Text style={[styles.cell, styles.col5]}>Fuel Quantity</Text>
                </View>

                {Object.entries(modal?.item?.metadata?.invoiceFuelItems?.items)?.map((item: AnyType, index: number) => (
                  <View style={styles.tableRow} key={index}>
                    <Text style={[styles.cell, styles.col1]}>{index+1}</Text>
                    <Text style={[styles.cell, styles.col2]}>{item[0]}</Text>
                    <Text style={[styles.cell, styles.col3]}>{item[1]?.tripFuel}</Text>
                    <Text style={[styles.cell, styles.col4]}>{item[1]?.tripCount}</Text>
                    <Text style={[styles.cell, styles.col5]}>{item[1]?.fuelQuantity}</Text>
                  </View>
                ))}
                <View style={styles.tableRow}>
                  <Text style={[styles.cell, { width: "80%", textAlign: "center" }]}>Total</Text>
                  <Text style={[styles.cell, styles.col5]}>{modal?.item?.metadata?.invoiceItems?.items?.["otherDepotTripFuel"]?.quantity}</Text>
                </View>
              </View>

              <Footer />
            </Page>
          </Document>
        // </PDFViewer>
      // )}
    // </ModalComponent>
  )
}
