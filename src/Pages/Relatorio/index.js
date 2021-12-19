import React, { useContext, useState, useEffect } from 'react';
import { Alert, TouchableOpacity, Platform, View, Text } from 'react-native';
import firebase from '../../services/firebaseConnection';
import { format, isBefore } from 'date-fns';
import { IconButton, Colors, Button } from 'react-native-paper';
import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import HistoricoList from '../../components/HistoricoList';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from '../../components/DatePicker';

import { Background, Container, Nome, Saldo, Title, List, Area } from './styles';

export default function Relatorio({ navigation }) {
  const auxDate = new Date();
  console.log('->',new Date(auxDate.getFullYear(), auxDate.getMonth() , 1))
  const [categoria, setCategoria] = useState(`${new Date(auxDate.getFullYear(), auxDate.getMonth() , 1)}`)
  const [historico, setHistorico] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const now = new Date();
  const { user } = useContext(AuthContext);
  const uid = user && user.uid;

  const [newDate, setNewDate] = useState(new Date());
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function loadList() {
      await firebase.database().ref('users').child(uid).on('value', (snapshot) => {
        setSaldo(snapshot.val().saldo);
      });

      await firebase.database().ref('historico')
        .child(uid)
        .orderByChild('date')
        .limitToLast(10).on('value', (snapshot) => {
          setHistorico([]);

          snapshot.forEach((childItem) => {
            let list = {
              key: childItem.key,
              tipo: childItem.val().tipo,
              descricao: childItem.val().descricao,
              categoria: childItem.val().categoria,
              createdAt: childItem.val().createdAt,
              valor: childItem.val().valor,
              date: childItem.val().date,
            };
            
            setHistorico(oldArray => [...oldArray, list].reverse());

          })
        })

    }

    loadList();
  }, [newDate]);

  async function findBydate(_date) {
    try {
    ;
    const  oldDate = new Date(_date);
    //console.log('oldDate', oldDate);
    const start = new Date(oldDate.getFullYear(), oldDate.getMonth(), 1)
    const end = new Date(oldDate.getFullYear(), oldDate.getMonth()+1, 0)
   // console.log('start', start, 'end', end);
   let newList = []
    await firebase.database().ref('historico')
      .child(uid)
      .orderByChild('createdAt')
      .limitToLast(10).on('value', (snapshot) => {
        setHistorico([]);

        snapshot.forEach((childItem) => {
          let list = {
            key: childItem.key,
            tipo: childItem.val().tipo,
            descricao: childItem.val().descricao,
            categoria: childItem.val().categoria,
            valor: childItem.val().valor,
            createdAt: childItem.val().createdAt,
            date: childItem.val().date,
          };
          newList.push(list);
          setHistorico(oldArray => [...oldArray, list].reverse());

        })
        
      setHistorico(
        newList.filter((value)=>{
          console.log(value.createdAt)
          const dt= new Date(value.createdAt)
          console.log('dt', dt.getMonth(), 'ts', start.getMonth())
          if(dt.getMonth() == start.getMonth()){
            console.log(true)
            return value;
          }
       
        })
      )
      })

    } catch (error) {
        console.log('e', error)
    }

  }
  function handleDelete(data) {

    //Pegando data do item:
    const [diaItem, mesItem, anoItem] = data.date.split('/');
    const dateItem = new Date(`${anoItem}/${mesItem}/${diaItem}`);


    //Pegando data hoje:
    const formatDiaHoje = format(new Date(), 'dd/MM/yyyy');
    const [diaHoje, mesHoje, anoHoje] = formatDiaHoje.split('/');
    const dateHoje = new Date(`${anoHoje}/${mesHoje}/${diaHoje}`);
   



    if (isBefore(dateItem, dateHoje)) {
      // Se a data do registro já passou vai entrar aqui!
      alert('Voce nao pode excluir um registro antigo!');
      return;
    }

    Alert.alert(
      'Cuidado Atençao!',
      `Você deseja excluir ${data.tipo} - Valor: ${data.valor}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Continuar',
          onPress: () => handleDeleteSuccess(data)
        }
      ]
    )

  }


  async function handleDeleteSuccess(data) {
    await firebase.database().ref('historico')
      .child(uid).child(data.key).remove()
      .then(async () => {
        let saldoAtual = saldo;
        data.tipo === 'despesa' ? saldoAtual += parseFloat(data.valor) : saldoAtual -= parseFloat(data.valor);

        await firebase.database().ref('users').child(uid)
          .child('saldo').set(saldoAtual);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function handleShowPicker() {
    setShow(true);
  }

  function handleClose() {
    setShow(false);
  }

  const onChange = (date) => {
    setShow(Platform.OS === 'ios');
    setNewDate(date);
    console.log(date);
  }
  /*
     <!---->   {show && (
          <DatePicker
            onClose={handleClose}
            date={newDate}
            onChange={onChange}
          />
        )}
         */
  return (
    <Background>
      <Header />
      <View style={{ padding: 5, margin: 5, flexDirection: 'row', alignItems: 'center', justifyContent:'space-between' }}>
        <View>
          <Text style={{color:'green'}}>Categoria</Text>
          <Picker
            selectedValue={categoria}
            mode='dialog'
            color='green'
            style={{
              width: 200,
              color:'green'
            }}
            onValueChange={(itemValue, itemIndex) =>
              {console.log(itemValue)
              setCategoria(itemValue)}
            }>
            <Picker.Item label="Janeiro"    value={`${new Date(now.getFullYear(), 0 , 1)}`} />
            <Picker.Item label="Fevereiro"  value={`${new Date(now.getFullYear(), 1, 1)}`} />
            <Picker.Item label="Março"      value={`${new Date(now.getFullYear(), 2, 1)}`} />
            <Picker.Item label="Abril"      value={`${new Date(now.getFullYear(), 3, 1)}`} />
            <Picker.Item label="Maio"       value={`${new Date(now.getFullYear(), 4, 1)}`} />
            <Picker.Item label="Junho"      value={`${new Date(now.getFullYear(), 5, 1)}`} />
            <Picker.Item label="Julho"      value={`${new Date(now.getFullYear(), 6, 1)}`} />
            <Picker.Item label="Agosto"     value={`${new Date(now.getFullYear(), 7, 1)}`} />
            <Picker.Item label="Setembro"   value={`${new Date(now.getFullYear(), 8, 1)}`} />
            <Picker.Item label="Outubro"    value={`${new Date(now.getFullYear(), 9, 1)}`} />
            <Picker.Item label="Novembro"   value={`${new Date(now.getFullYear(), 10, 1)}`} />
            <Picker.Item label="Dezembro"   value={`${new Date(now.getFullYear(), 11, 1)}`} />

          </Picker>
        </View>
        <Button color='green' mode='contained' onPress={()=>findBydate(categoria)}>
          Buscar
        </Button>
      </View>
      <List
        showsVerticalScrollIndicator={false}
        data={historico}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (<HistoricoList data={item} deleteItem={handleDelete} />)}
      />


    </Background>
  );
}