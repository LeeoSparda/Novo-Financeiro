import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { stringDate, formatarMoeda } from '../repository_functions';
import { Container, BoxRow, IconView, Submit, ValorText } from './styles';
import { Button } from 'react-native-paper';

export default function HistoricoList({ data, deleteItem }) {
    console.log(data)
    return (
        <TouchableWithoutFeedback onLongPress={() => deleteItem(data)}>
            <Container style={{ elevation: 1, backgroundColor: '#fff' }}>
                <View>
                    <BoxRow >
                         <Text style={{ textAlign: 'center', marginLeft: 15 }}>{data.date}</Text>
                        <Text style={{ marginLeft: 10 }}> Categoria: {data.categoria}</Text>
                    </BoxRow>
                    <BoxRow style={{ justifyContent: 'space-between' }}>
                    <View style={{flexDirection:'row'}}>
                        <Icon
                            name={data.tipo === 'Despesa' ? 'arrow-down' : 'arrow-up'}
                            color={data.tipo === 'Despesa' ? 'red' : 'green'}
                            size={30}
                            style={{ fontWeight: 'bold', }}
                        />
                              <View style={{}}>
                            <BoxRow>
                                <ValorText style={{ marginLeft: 10 }}>
                                    R$ {formatarMoeda(data.valor)}
                                </ValorText>
                            
                                    <Text style={{ fontSize: 22, marginLeft: 15 }}>
                                        {data.descricao}
                                    </Text>
                            </BoxRow>
                     
                        
                           
                        </View>
                    </View>


                  
                   
                    <Submit onPress={() => { deleteItem(data) }}>
                        <Icon
                            name='delete'
                            size={20}
                            style={{ fontWeight: 'bold' }}
                        />
                    </Submit>
                </BoxRow>
                </View>
            </Container>
        </TouchableWithoutFeedback>
    );
}