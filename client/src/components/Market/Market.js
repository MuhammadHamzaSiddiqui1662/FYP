import { LineChart, Line, ResponsiveContainer, Label, XAxis, YAxis, Tooltip } from 'recharts';
import { useMarket } from '../../hooks/useMarket';
import './Market.css';

const contentStyle = {
    backgroundColor: "#121",
    borderColor: "#00ff2233"
}

export const Market = ({ tokens, selectedToken }) => {
    const { trades, batTrades, repTrades, zrxTrades, isLoading } = useMarket(tokens);
    const mainData = selectedToken.symbol === "BAT" ? batTrades : selectedToken.symbol === "REP" ? repTrades : zrxTrades;
    const otherData = selectedToken.symbol === "BAT" ? [repTrades, zrxTrades] : selectedToken.symbol === "REP" ? [batTrades, zrxTrades] : [batTrades, repTrades];
    const otherDataLabels = selectedToken.symbol === "BAT" ? ["REP", "ZRX"] : selectedToken.symbol === "REP" ? ["BAT", "ZRX"] : ["BAT", "REP"];
    return !isLoading ? (
        <div className="market">
            <div className='mainChart'>
                <ResponsiveContainer width={"100%"} height={380}>
                    <LineChart data={mainData}>
                        <Line type="monotone" dataKey="price" stroke="#00ff22" />
                        <XAxis dataKey="date" type='category'>
                            <Label value="Timestamp" position="insideBottom" offset={0} />
                        </XAxis>
                        <YAxis dataKey="price">
                            <Label value={`${selectedToken.symbol} Prices`} domain={[0, 'dataMax']} angle={-90} offset={10} position="insideBottomLeft" />
                        </YAxis>
                        <Tooltip contentStyle={contentStyle} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className='otherCharts'>
                <ResponsiveContainer width={"45%"} height={300}>
                    <LineChart data={otherData[0]}>
                        <Line type="monotone" dataKey="price" stroke="#00ff22" />
                        <XAxis dataKey="date">
                            <Label value="Timestamp" offset={0} position="insideBottom" />
                        </XAxis>
                        <YAxis>
                            <Label value={`${otherDataLabels[0]} Prices`} angle={-90} offset={10} position="insideBottomLeft" />
                        </YAxis>
                        <Tooltip contentStyle={contentStyle} />
                    </LineChart>
                </ResponsiveContainer>
                <ResponsiveContainer width={"45%"} height={300}>
                    <LineChart data={otherData[1]}>
                        <Line type="monotone" dataKey="price" stroke="#00ff22" />
                        <XAxis dataKey="date">
                            <Label value="Timestamp" offset={0} position="insideBottom" />
                        </XAxis>
                        <YAxis>
                            <Label value={`${otherDataLabels[1]} Prices`} angle={-90} offset={10} position="insideBottomLeft" />
                        </YAxis>
                        <Tooltip contentStyle={contentStyle} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
        : null
}