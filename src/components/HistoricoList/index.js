import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { stringDate, formatarMoeda } from '../repository_functions';
import { Container, BoxRow, IconView, Submit, ValorText } from './styles';
import { Button } from 'react-native-paper';

export default function HistoricoList({ data, deleteItem }) {

    return (
        <TouchableWithoutFeedback  onLongPress={() => deleteItem(data)}>
            <Container style={{elevation: 1, backgroundColor: '#fff'}}>
                <BoxRow style={{justifyContent: 'space-between'}}>
                <BoxRow>
                    <Icon
                        name={data.tipo === 'despesa' ? 'arrow-down' : 'arrow-up'}
                        color={data.tipo === 'despesa' ? 'red' : 'green'}
                        size={20}
                        style={{fontWeight: 'bold', }}
                    />
                    <ValorText style={{marginLeft: 10}}>
                        R$ {formatarMoeda(data.valor)}
                    </ValorText>
         
                </BoxRow>
                <Submit onPress={()=>{ deleteItem(data)}}>
                <Icon
                        name='delete'
                        size={20}
                        style={{fontWeight: 'bold'}}
                    />
                </Submit>
              
                </BoxRow>
          
                <Text style={{ textAlign: 'center' }}>
                    {data.date}
                </Text>
            </Container>
        </TouchableWithoutFeedback>
    );
}