import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Define interfaces for type safety
interface ReportData {
  title: string;
  summary: Record<string, number | string>;
  tableData?: Array<Record<string, string | number>>;
}

interface ReportPDFProps {
  data: ReportData;
  tallerName: string;
  periodo: string;
  charts: {
    area?: string;
    pie?: string;
  }
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#E11D48',
    paddingBottom: 20,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 32,
    height: 32,
    backgroundColor: '#E11D48',
    borderRadius: 8,
    marginRight: 10,
  },
  brandName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  brandSuffix: {
    color: '#E11D48',
    fontSize: 10,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  titleSection: {
    marginBottom: 30,
  },
  reportTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0F172A',
  },
  metadata: {
    flexDirection: 'row',
    gap: 15,
  },
  metaItem: {
    fontSize: 9,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 30,
  },
  statCard: {
    width: '23%',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#E11D48',
  },
  statLabel: {
    fontSize: 8,
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 15,
    marginTop: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderLeftWidth: 3,
    borderLeftColor: '#E11D48',
    paddingLeft: 10,
  },
  chartContainer: {
    height: 220,
    width: '100%',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  chartsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  halfChartContainer: {
    flex: 1,
    height: 180,
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  chartImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  table: {
    width: 'auto',
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    padding: 8,
  },
  tableColHeader: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#475569',
    flex: 1,
  },
  tableCol: {
    fontSize: 8,
    color: '#1E293B',
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  pageNumber: {
    fontSize: 8,
    color: '#94A3B8',
  }
});

export const ReportPDF = ({ data, tallerName, periodo, charts }: ReportPDFProps) => {
  const tableKeys = data.tableData && data.tableData.length > 0 
    ? Object.keys(data.tableData[0]).filter(k => k !== 'id') 
    : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <View style={styles.logoBox} />
            <Text style={styles.brandName}>PLAVET</Text>
            <Text style={styles.brandSuffix}>REPORTS</Text>
          </View>
          <Text style={styles.metaItem}>{new Date().toLocaleDateString()}</Text>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.reportTitle}>{data.title}</Text>
          <View style={styles.metadata}>
            <Text style={styles.metaItem}>Taller: {tallerName}</Text>
            <Text style={styles.metaItem}>Periodo: {periodo}</Text>
          </View>
        </View>

        {/* Summary Stats */}
        <View style={styles.statsGrid}>
          {Object.entries(data.summary).map(([key, value], i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statLabel}>{key.replace(/([A-Z])/g, ' $1')}</Text>
              <Text style={styles.statValue}>{String(value)}</Text>
            </View>
          ))}
        </View>

        {/* Analytics Section */}
        {charts.area && (
          <View>
            <Text style={styles.sectionTitle}>Análisis de Tendencias e Indicadores</Text>
            <View style={styles.chartContainer}>
              <Image src={charts.area} style={styles.chartImage} />
            </View>
          </View>
        )}

        {charts.pie && (
          <View style={styles.chartsRow}>
            <View style={styles.halfChartContainer}>
              <Text style={styles.statLabel}>Distribución de Resultados</Text>
              <Image src={charts.pie} style={styles.chartImage} />
            </View>
            <View style={styles.halfChartContainer}>
              <Text style={styles.statLabel}>Resumen Interpretativo</Text>
              <View style={{ marginTop: 20, gap: 10 }}>
                <Text style={{ fontSize: 9, color: '#64748B', lineHeight: 1.5 }}>
                  Este informe técnico presenta el desempeño consolidado del área seleccionada. Los indicadores visuales reflejan la eficiencia operativa y el cumplimiento de metas académicas.
                </Text>
                <Text style={{ fontSize: 9, color: '#64748B', lineHeight: 1.5 }}>
                  Certificado por el motor de inteligencia de Plavet para el periodo institucional {periodo}.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Table */}
        <Text style={styles.sectionTitle}>Detalle de Registros</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            {tableKeys.map((key, i) => (
              <Text key={i} style={styles.tableColHeader}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</Text>
            ))}
          </View>
          {data.tableData?.slice(0, 10).map((row, i) => (
            <View key={i} style={styles.tableRow}>
              {tableKeys.map((key, j) => (
                <Text key={j} style={styles.tableCol}>{String(row[key])}</Text>
              ))}
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Documento Oficial Institucional - Plavet Engine</Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `${pageNumber} / ${totalPages}`
          )} fixed />
        </View>
      </Page>
    </Document>
  );
};
